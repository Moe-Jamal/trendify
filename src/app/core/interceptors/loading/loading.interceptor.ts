import { CategoryService } from './../../services/category/category.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const ngxSpinnerService = inject(NgxSpinnerService);
  const categoryService = inject(CategoryService);
  if (req.method === 'GET') {
    ngxSpinnerService.show();
    categoryService.contentload.set(false);
  }
  return next(req).pipe(
    finalize(() => {
      setTimeout(() => {
        categoryService.contentload.set(true);
      }, 200);
      ngxSpinnerService.hide();
    })
  );
};
