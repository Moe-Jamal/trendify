import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpClient: HttpClient) {}

  setGetCategory(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories`);
  }

  setGetProducts(categoryId?: string): Observable<any> {
    let params = new HttpParams();

    if (categoryId) {
      params = params.set('category[in]', categoryId);
    }

    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/`, {
      params,
    });
  }

  setGetBrands(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/brands?limit=40`);
  }
}
