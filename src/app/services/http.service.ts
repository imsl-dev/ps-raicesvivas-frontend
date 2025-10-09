import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//Para Requests varias que no justifican hacer un service especifico, por ejemplo: get provincias
export class HttpService {

  constructor(private http: HttpClient) { }

  private readonly API_URL = 'http://localhost:8080/api';

  getProvincias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/provincias`);
  }
}