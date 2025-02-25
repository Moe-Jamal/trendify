import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpClient: HttpClient) {}

  contentload: WritableSignal<boolean> = signal(true);
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
  setGetProductsWithLimit(
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    page?: number,
    sort: string = 'price'
  ): Observable<any> {
    let params = new HttpParams().set('limit', '12').set('sort', sort);

    if (categoryId) {
      params = params.set('category[in]', categoryId);
    }
    if (minPrice !== undefined) {
      params = params.set('price[gte]', minPrice.toString());
    }
    if (maxPrice !== undefined) {
      params = params.set('price[lte]', maxPrice.toString());
    }
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }

    return this.httpClient.get(`${environment.baseUrl}/api/v1/products`, {
      params,
    });
  }

  setGetProductDetails(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/${id}`);
  }

  setGetBrands(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/brands?limit=40`);
  }
}
