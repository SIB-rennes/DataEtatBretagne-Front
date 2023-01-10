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
import { LoaderService } from '@services/loader.service';

@Injectable()
export class CommonHttpInterceptor implements HttpInterceptor {
  constructor(private loader: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loader.startLoader();

    // return next.handle(req);
    return next.handle(req).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          console.log(event);
          if (event instanceof HttpResponse) {
            this.loader.endLoader();
          }
        },
        error: (_error: HttpErrorResponse) => {
          this.loader.endLoader();
        },
      })
    );
  }
}
