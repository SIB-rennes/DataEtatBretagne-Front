import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

/**
 * Service to manage authentication
 */
@Injectable({
  providedIn: 'root',
})
export class ChorusHttpService {
  constructor(private http: HttpClient) {}
}
