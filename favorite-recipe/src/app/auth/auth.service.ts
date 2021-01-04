import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { reduceState, Store } from '@ngrx/store';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, UserDTO } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(
        private http: HttpClient,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) { }


    // user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    // apiKey = 'AIzaSyA_Aa8P3roWV_yOP4coP7y0cpsBN7k1Yhc';
    apiKey = environment.firebaseAPIKey;
    signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
    signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

    // signUp(email: string, password: string): Observable<AuthResponseData> {
    //     return this.http
    //         .post<AuthResponseData>(this.signUpUrl, new UserDTO(email, password, true))
    //         .pipe(
    //             catchError(this.handleError),
    //             tap(this.handleAuthentication.bind(this))
    //         );
    // }

    autoLogin(): void {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const tokenExpirationDate = new Date(userData._tokenExpirationDate);
        const loadedUser = new User(
            userData.id,
            userData.email,
            userData._token,
            tokenExpirationDate
        );

        if (loadedUser.token) {
            // this.user.next(loadedUser);
            this.store.dispatch(new AuthActions.AuthenticateSuccess({
                email: loadedUser.email,
                userId: loadedUser.id,
                token: loadedUser.token,
                expirationDate: tokenExpirationDate,
                redirect: false
            }));

            const expirationDuration = tokenExpirationDate.getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    // login(email: string, password: string): Observable<AuthResponseData> {
    //     return this.http
    //         .post<AuthResponseData>(this.signInUrl, new UserDTO(email, password, true))
    //         .pipe(
    //             catchError(this.handleError),
    //             tap(this.handleAuthentication.bind(this))
    //         );
    // }

    autoLogout(expirationDuration: number): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    logout(): void {
        // this.user.next(null);
        // this.store.dispatch(new AuthActions.Logout());
        localStorage.removeItem('userData');

        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;

        // this.router.navigate(['/auth']);
    }

    // private handleAuthentication(resData: AuthResponseData): void {
    //     const expirationDuration = +resData.expiresIn * 1000;
    //     const expirationDate = new Date(new Date().getTime() + expirationDuration);

    //     const user = new User(
    //         resData.localId,
    //         resData.email,
    //         resData.idToken,
    //         expirationDate
    //     );

    //     // this.user.next(user);
    //     this.store.dispatch(new AuthActions.AuthenticateSuccess({
    //         email: resData.email,
    //         userId: resData.localId,
    //         token: resData.idToken,
    //         expirationDate
    //     }));

    //     this.autoLogout(expirationDuration);
    //     localStorage.setItem('userData', JSON.stringify(user));
    // }

    // private handleError(errorRes: HttpErrorResponse): Observable<never> {
    //     let errorMessage = 'An unknown error occurred.';
    //     if (!errorRes.error || !errorRes.error.error) {
    //         return throwError(errorMessage);
    //     }

    //     switch (errorRes.error.error.message) {
    //         case 'EMAIL_EXISTS':
    //             errorMessage = 'This email already exists.';
    //             break;
    //         case 'EMAIL_NOT_FOUND':
    //         case 'INVALID_PASSWORD':
    //             errorMessage = 'Invalid email or password.';
    //             break;
    //     }

    //     return throwError(errorMessage);
    // }

    setLogoutTimer(expirationDuration: number): void {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout());
        }, expirationDuration);
    }

    clearLogoutTimer(): void {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}
