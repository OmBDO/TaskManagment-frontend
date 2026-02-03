import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const response_formatInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (typeof error.error == 'string') {
        return throwError(() => error.error);
      }

      if (typeof error.message == 'string') {
        if (error.message.includes('Http failure response for ' + req.url + ': 0 Unknown Error')) {
          setTimeout(() => {
            router.navigate(['/error', error.status, error.message]);
          }, 2000);
          return throwError(() => error.message);
        }
      }
      const errorMessage = 'Unknown Error Occure please Try agin';
      return throwError(() => errorMessage);
    }),
  );
};
