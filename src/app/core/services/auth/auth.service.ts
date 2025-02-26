import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IUser } from '../../../shared/interfaces/iuser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}
  private readonly router = inject(Router);

  userData: IUser | null = {} as IUser;
  setRegisterData(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signup`,
      data
    );
  }

  setLoginData(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      data
    );
  }

  saveUserData(): void {
    if (localStorage.getItem('authToken')) {
      this.userData = jwtDecode(localStorage.getItem('authToken')!);
    }
  }

  setEmailVerify(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      data
    );
  }

  setResetCode(code: string): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      {
        resetCode: code?.trim(),
      }
    );
  }

  setResetPassword(userEmail: string, userPassword: string): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      {
        email: userEmail,
        newPassword: userPassword,
      }
    );
  }

  setChangePassword(data: object): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/users/changeMyPassword`,
      data
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.userData = null;
    this.router.navigate(['/login']);
  }
}
