import { Component, OnDestroy } from '@angular/core';
import { CalculationService } from '../../services/calculation.service';
import { Observable, of, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  isStatisticPage$ = this.calculationService.statisticPage$;
  private $unsubscribe = new Subject<void>();

  constructor(
    private calculationService: CalculationService,
  ) {}

  downloadTemplateFile(): void {
    console.log('click');
    this.calculationService.downloadTemplate()
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((response: Blob) => this.createDownloadLink(response));
  }

  createDownloadLink(file: Blob): void {
    let downloadLink = document.createElement('a');

    downloadLink.href = URL.createObjectURL(file);
    downloadLink.setAttribute('download', 'statistic-data-template.xlsx')
    downloadLink.click();
  }

  ngOnDestroy() {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
