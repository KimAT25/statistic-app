import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { combineLatest, Subject, switchMap, take, takeUntil } from 'rxjs';

import { CalculationService } from '../../services/calculation.service';

import { DISPLAYED_COLUMNS, DISPLAYED_COLUMNS_CHAIN, YEAR_LIST } from './const/calc.const';
import { MatSnackBar } from '@angular/material/snack-bar';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-calculation-page',
  templateUrl: './calculation-page.component.html',
  styleUrls: ['./calculation-page.component.scss'],
  animations: [
    trigger('openClose', [
      state('true', style({ height: AUTO_STYLE, opacity: 1, 'padding-bottom': '5px' })),
      state('false', style({ height: 0, opacity: 0 })),
      transition('true <=> false', animate('250ms ease-in-out'))
    ])
  ],
})
export class CalculationPageComponent implements OnInit, OnDestroy {
  calculationForm!: FormGroup;
  yearList:any = [];
  displayedColumns = DISPLAYED_COLUMNS;
  displayedColumnsChain = DISPLAYED_COLUMNS_CHAIN;

  panelOpenState = false;

  allDataByRegion: any = [];
  calculatedDataByRegion: any = [];
  standardValueOfJ: any = [];
  complexAbsIntegralParams!: number;

  baseIntegralTempIndexData: any[] = [];

  chainIntegralTempIndexData: any[] = [];
  readyFileToUpload: any;

  fileName: string | undefined;

  private $unsubscribe = new Subject<void>();

  constructor(
    private calculationService: CalculationService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
    ) {}

  ngOnInit() {
    this.calculationService.statisticPage$.next(true);
    this.calculationService.getYearListFromFile().subscribe({
      next: data => {
        this.yearList = data?.years ? data.years : [];
        if (this.yearList.length > 0) {
          this.setForm();
          this.fileName = data.fileName;
        }
      },
      error: (error) => console.log(error)
    });

  }

  setForm(): void {
    this.calculationForm = this.fb.group({
      year: [1],
      mainYear: [this.yearList[this.yearList.length - 1].value],
      comparableYear: [1],
      range: [1],
    });
  }

  selectedYear(event: MatSelectChange, control: FormControl): void {
   control.setValue(event.value);
  }

  calcComplexAbsParam = () => {
    this.complexAbsIntegralParams = 0;
    if (this.allDataByRegion.yearData?.length > 0) {
      const average = this.getAverageForRegion(this.allDataByRegion.yearData);
      const sigma = this.calculateSigma(this.allDataByRegion.yearData, average);
      this.allDataByRegion.yearData.forEach((region: any, idx: number) => {
        const calcValue = (region.value / sigma).toFixed(2);
        const obj = {
          position: 1 + idx,
          regionName: region.regionName,
          value: +calcValue
        }
        this.standardValueOfJ = [...this.standardValueOfJ, obj];
      });
      this.complexAbsIntegralParams = +(this.standardValueOfJ.reduce(
        (accumulator: any, current: any) => accumulator + current.value, 0).toFixed(2));
    } else {
      this.openSnack('Будь ласка обчисліть попередню формулу спочатку');
    }
  }

  calcStandardFirstParams = () => {
    this.standardValueOfJ = [];
    const year = this.calculationForm.controls['year'].value;
    console.log(year);
    this.calculationService.getDataByYearById(year)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: data => {
          console.log(data);
          this.allDataByRegion = data;
          if (data.yearData.length > 0) {
            console.log(this.allDataByRegion);
            const average = this.getAverageForRegion(data.yearData);
            const sigma = this.calculateSigma(data.yearData, average);
            this.calculatedDataByRegion = this.calculateStandardFirstParamValue(data.yearData, average, sigma);
          }
        },
        error: () => this.openSnack('Щось пішло не так, будь ласка спробуйте щераз')
      });
  }

  getAverageForRegion(data: any[]): number {
    const sum = data.reduce(
      (accumulator, current) => accumulator + (current.value ? current.value : current), 0);
    return (sum / data.length);
  }

  calculateSigma(data: any[], average: number): number {
    let differenceArray: any[] = [];
    data.map(region => {
      const difference = (region.value - average).toFixed(2);
      differenceArray = [...differenceArray, Math.pow(+difference, 2)];
    })
    const sum = this.getAverageForRegion(differenceArray);
    const sigma = Math.pow(sum, 0.5).toFixed(2);
    return +sigma;
  }

  calculateStandardFirstParamValue(data: any[], average: number, sigma: number): any[] {
    let standardFirstParamArray: any[] = [];
    data.forEach((region: any, idx: number) => {
      const calcValue = ((region.value - average) / sigma).toFixed(2);
      const obj = {
        position: idx + 1,
        regionName: region.regionName,
        value: +calcValue
      }
      standardFirstParamArray = [...standardFirstParamArray, obj];
    })

    return standardFirstParamArray;
  }

  calcBaseIntegralTempIndex = () => {
    this.baseIntegralTempIndexData = [];
    const mainYear = this.calculationForm.controls['mainYear'].value;
    const comparableYear = this.calculationForm.controls['comparableYear'].value;

    combineLatest([
      this.calculationService.getDataByYearById(mainYear),
      this.calculationService.getDataByYearById(comparableYear),
    ]).pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: ([mainYearData, comparableYearData]: any) => {
          if (mainYearData.yearData.length > 0 && comparableYearData.yearData.length > 0) {
            mainYearData.yearData.forEach((region: any, idx: number) => {
              const calcValue = region.value / comparableYearData.yearData[idx].value;
              const obj = {
                position: idx + 1,
                regionName: region.regionName,
                value: +calcValue.toFixed(2)
              }
              this.baseIntegralTempIndexData = [...this.baseIntegralTempIndexData, obj];
            })
          }
        },
        error: () => this.openSnack('Щось пішло не так, будь ласка спробуйте щераз')
      })
  }

  calcChainBaseIntegralTempIndex = () => {
    this.chainIntegralTempIndexData = [];
    this.calculationService.getStatisticByRegionData()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe({
        next: allRegionData => {
          allRegionData.forEach((region: any, index: number) => {
            region.regionData.reverse().forEach((el: any, idx: number, array: any) => {
              if (array[idx] && array[idx + 1] && array[idx].year !== array[idx + 1].year) {
                const tempIndexOne = +((array[idx].value / array[idx + 1].value).toFixed(2));
                const tempIndexTwo = +((array[idx].valueF2 / array[idx + 1].valueF2).toFixed(2));
                const tempValue = Math.pow((tempIndexOne + 1) * (tempIndexTwo + 1), 2) - 1;
                const chainIntegralTempIndex = Math.pow(tempValue, 0.5).toFixed(2);
                const obj = {
                  comparablePairs: `${array[idx].year}/${array[idx + 1].year}`,
                  position: index + 1,
                  regionName: region.regionName,
                  value: +chainIntegralTempIndex,
                }
                this.chainIntegralTempIndexData = [...this.chainIntegralTempIndexData, obj];
              }
            })
          })
        },
        error: () => this.openSnack('Щось пішло не так, будь ласка спробуйте щераз')
      });
  }

  openSnack(message: string) {
    const durationValue = 5;
    this._snackBar.open(
      message,
      'закрити',
      {
        duration: durationValue * 1000,
        horizontalPosition: 'right'
      });
  }

  onFileChange(event: Event) {
    if (event) {
      const target = event.target! as HTMLInputElement;
      const file = target.files?.length ? target.files[0] : null;

      if (file) {
        this.validateFileFormat(target, file);
      }
      target.value = '';
    }
  }

  uploadFile() {
    if (this.readyFileToUpload) {
      const formData = new FormData();

      formData.append('file', this.readyFileToUpload);
      formData.append('fileName', this.fileName!);

      this.calculationService.sendFile(formData)
        .pipe(
          take(1),
          takeUntil(this.$unsubscribe),
          switchMap(() => this.calculationService.getYearListFromFile())
        )
        .subscribe({
          next: (data: any) => {
            this.openSnack('Файл було успішно завантажено');
            this.yearList = data.years;
            if (this.yearList.length > 0) {
              this.setForm();
              this.fileName = data.fileName;
              this.readyFileToUpload = undefined;
            }
          },
          error: (error) =>
            this.openSnack(
              error.status === 400 ?
                'обидві книги у файлі не містять данних, заповніть дані та спробуйте щераз' :
                  'невдалось загрузити файл на сервер, спробуйте знову'
            )
        })
    }
  }

  validateFileFormat(target: HTMLInputElement, file: any): void {
    const splitFile = file.name.split('.');
    const fileType = splitFile[1].toLowerCase();

    if (fileType !== 'xlsx' && fileType !== 'xls') {
      this.removeFile(target);
      this.openSnack('Будь ласка завантажте файл з розширенням .xls, .xlsx')
      return;
    }

    this.fileName = splitFile[0].toUpperCase();
    this.readyFileToUpload = file;
  }

  removeFile(target?: HTMLInputElement): void {
    if (target) {
      target.value = '' ;
    }
    this.fileName = undefined;
    this.readyFileToUpload = undefined;
  }

  ngOnDestroy() {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
    this.calculationService.statisticPage$.next(false);
  }
}
