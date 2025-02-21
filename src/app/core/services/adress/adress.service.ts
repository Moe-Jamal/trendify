import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdressService {
  constructor(private httpClient: HttpClient) {}

  setAddAdress(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/addresses`,
      data
    );
  }

  setRemoveAdress(userId: string): Observable<any> {
    return this.httpClient.delete(
      `${environment.baseUrl}/api/v1/addresses/${userId}`
    );
  }

  getLoggedUserAdress(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/addresses`);
  }
}
