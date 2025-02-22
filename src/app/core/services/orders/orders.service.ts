import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private httpClient: HttpClient) {}

  setCashOrder(cartId: string, addressInfo: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/orders/${cartId}`,
      {
        shippingAddress: addressInfo,
      }
    );
  }

  setOnlineOrder(cartId: string, addressInfo: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=https://trendify-coral.vercel.app/`,
      {
        shippingAddress: addressInfo,
      }
    );
  }

  getUserOrders(userId: string): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}/api/v1/orders/user/${userId}`
    );
  }
}
