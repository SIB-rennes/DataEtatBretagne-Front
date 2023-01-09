import { Component, OnInit } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { SessionService } from './services/session.service';

@Component({
  selector: 'financial-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public progressBarVisible: boolean = false;
  public isAuthenticated: boolean = false;

  constructor(
    private loaderService: LoaderService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading().subscribe((loading) => {
      this.progressBarVisible = loading;
    });

    this.sessionService.getUser().subscribe((user) => {
      this.isAuthenticated = user !== null;
    });
  }
}
