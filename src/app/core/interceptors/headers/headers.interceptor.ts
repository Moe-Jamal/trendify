import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  if (localStorage.getItem('authToken')) {
    req = req.clone({
      setHeaders: {
        token: localStorage.getItem('authToken')!,
      },
    });
  }
  return next(req);
};
