import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';
import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private loggingService: LoggingService,
              private store: Store<fromApp.AppState>) {}


  ngOnInit(): void {
    this.store.dispatch(new AuthActions.AutoLogin());
    // this.authService.autoLogin();
    // this.loggingService.printLog('Hello from App Component ngOnInit()!');
  }
}
