import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { SousAxePlanRelance } from '../models/axe.models';
import { FranceRelanceHttpService } from '../services/france-relance.http.service';

@Injectable({ providedIn: 'root' })
export class FranceRelanceResolvers
  implements Resolve<SousAxePlanRelance[] | Error>
{
  constructor(private service: FranceRelanceHttpService) {}

  resolve(): Observable<SousAxePlanRelance[] | Error> {
    return this.service.getSousAxePlanRelance();
  }
}
