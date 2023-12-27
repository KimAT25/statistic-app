import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {
  statisticPage$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  getStatisticByRegionData(): Observable<any> {
    const url = 'http://localhost:3000/api/byRegion';
    return this.http.get<any>(url);
  }

  getDataByYearById(id: number): Observable<any> {
    const url = `http://localhost:3000/api/byYear/${id}`;
    return this.http.get<any>(url);
  }

  sendFile(file: FormData): Observable<any> {
    const url = `http://localhost:3000/api/upload`;
    return this.http.post(url, file);
  }

  downloadTemplate(): Observable<any> {
    const url = `http://localhost:3000/api/download-template`;
    return this.http.get(url, {responseType: 'blob'});
  }

  getYearListFromFile(): Observable<any> {
    const url = `http://localhost:3000/api/year-list`;
    return this.http.get(url);
  }

}
