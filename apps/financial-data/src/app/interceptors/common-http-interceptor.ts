import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AlertService, LoaderService } from 'apps/common-lib/src/public-api';

@Injectable()
export class CommonHttpInterceptor implements HttpInterceptor {
  constructor(
    private loader: LoaderService,
    private alertService: AlertService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loader.startLoader();

    return next.handle(req).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.loader.endLoader();
          }
        },
        error: (_error: HttpErrorResponse) => {
          this.loader.endLoader();
          this.alertService.openAlertError('Une erreur est survenue');
        },
      })
    );
  }
}
