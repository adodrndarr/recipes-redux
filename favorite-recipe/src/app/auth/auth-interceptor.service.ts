import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {}


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
            // this.authService.user
        return this.store.select('auth') .pipe(
            take(1), // takes 1 value of the Observable and unsubscribes.
            map(authState => {
                return authState.user;
            }),
            exhaustMap(user => { // replace the user Observable with the next one
                if (!user) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({ params: new HttpParams().set('auth', user.token) });
                return next.handle(modifiedReq);
            })
        );
    }

}
