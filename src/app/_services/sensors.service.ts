import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SensorsService {
  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {
  }

  getSensorData() {
    let authToken = this.tokenStorageService.getToken();
    console.log("Auth token is: ", authToken);
    let headers = new HttpHeaders();
    headers = headers.append('Access-Control-Allow-Origin', '*');
    headers = headers.append('Authorization', `Bearer ${authToken}`);
  
    let result = this.http.get<any>("http://localhost:5000/api/v1/sensors", {headers: headers});
    return result;
  }
}
