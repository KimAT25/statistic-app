import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor(private http: HttpClient) {}

  getDataByRegion(): Observable<any> {
    const url = `http://localhost:3000/byRegion`;
    return this.http.get<any>(url);
  }

  // getDataByYear(): Observable<any> {
  //   const url = `http://localhost:3000/byYear`;
  //   return this.http.get<any>(url);
  // }

  // getDataByRegionById(id: number): Observable<any> {
  //   const url = `http://localhost:3000/byRegion/${id}`;
  //   return this.http.get<any>(url);
  // }

  getDataByYearById(id: number): Observable<any> {
    const url = `http://localhost:3000/byYear/${id}`;
    return this.http.get<any>(url);
  }
}
