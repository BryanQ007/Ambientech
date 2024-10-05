import { HttpClient } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EarthdataService {


private baseUrl = 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/'

constructor(private http: HttpClient) { }


getBestAvailable(): Observable<any> {
  return this.http.get(`${this.baseUrl}best/`, { responseType: 'blob' });
}

getStandard(): Observable<any> {
  return this.http.get(`${this.baseUrl}std/`);
}

getNearRealTime(): Observable<any> {
  return this.http.get(`${this.baseUrl}nrt/`);
}

getAll(): Observable<any> {
  return this.http.get(`${this.baseUrl}all/`);
}

}
