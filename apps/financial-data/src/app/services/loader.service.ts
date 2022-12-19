import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _isLoading = false;
  public loading$ = new Subject<boolean>();

  /**
   * Chargement en cours
   */
  public startLoader(): void {
    this._isLoading = true;
    this.loading$.next(this._isLoading);
  }

  /**
   *
   * @returns Observable loader
   */
  public isLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  /**
   * Chargement terminé
   */
  public endLoader(): void {
    this._isLoading = false;
    this.loading$.next(this._isLoading);
  }
}
