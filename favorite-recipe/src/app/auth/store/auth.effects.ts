import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { User, UserDTO } from '../user.model';
import * as AuthActions from './auth.actions';


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (
    expiresIn: number,
    email: string,
    userId: string,
    token: string
): AuthActions.AuthenticateSuccess => {
    const expirationDuration = +expiresIn * 1000;
    const expirationDate = new Date(new Date().getTime() + expirationDuration);

    const user = new User(userId, email, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));

    return new AuthActions.AuthenticateSuccess({
        email,
        userId,
        token,
        expirationDate,
        redirect: true
    });
};

const handleError = (errorRes: HttpErrorResponse): Observable<AuthActions.AuthenticateFail> => {
    let errorMessage = 'An unknown error occurred.';
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }

    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email already exists.';
            break;
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_PASSWORD':
            errorMessage = 'Invalid email or password.';
            break;
    }

    return of(new AuthActions.AuthenticateFail(errorMessage));
};


@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private http: HttpClient,
                private router: Router, private authService: AuthService) { }


    apiKey = environment.firebaseAPIKey;
    signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
    signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

    @Effect()
    authSignup = this.actions$
        .pipe(
            ofType(AuthActions.SIGNUP_START),
            switchMap((signupAction: AuthActions.SignupStart) => {
                return this.http
                    .post<AuthResponseData>(
                        this.signUpUrl,
                        new UserDTO(
                            signupAction.payload.email,
                            signupAction.payload.password,
                            true
                        )
                    )
                    .pipe(
                        tap(this.setLogoutTimer),
                        map(resData => handleAuthentication(
                            +resData.expiresIn,
                            resData.email,
                            resData.localId,
                            resData.idToken
                        )
                        ), // return an Observable so that you keep the effect running and not "die" once an error is thrown xD
                        catchError(handleError)
                    );
            })
        );

    @Effect()
    authLogin = this.actions$ // ngrx subscribes for us no need for .subscribe()
        .pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) => {
                const userToLogin = new UserDTO(
                    authData.payload.email,
                    authData.payload.password,
                    true
                );

                return this.http
                    .post<AuthResponseData>(this.signInUrl, userToLogin)
                    .pipe(
                        tap(this.setLogoutTimer),
                        map(resData => handleAuthentication(
                            +resData.expiresIn,
                            resData.email,
                            resData.localId,
                            resData.idToken
                        )
                        ), // return an Observable so that you keep the effect running and not "die" once an error is thrown xD
                        catchError(handleError)
                    );
            })
        );

    @Effect({ dispatch: false })
    authRedirectSuccess = this.actions$
        .pipe(
            ofType(AuthActions.AUTHENTICATE_SUCCESS),
            tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
                if (authSuccessAction.payload.redirect) {
                    this.router.navigate(['/']);
                }
            })
        );

    @Effect()
    autoLogin = this.actions$
        .pipe(
            ofType(AuthActions.AUTO_LOGIN),
            map(() => {
                const userData: {
                    email: string,
                    id: string,
                    _token: string,
                    _tokenExpirationDate: string
                } = JSON.parse(localStorage.getItem('userData'));
                if (!userData) {
                    return { type: 'Dummy' };
                }

                const tokenExpirationDate = new Date(userData._tokenExpirationDate);
                const loadedUser = new User(
                    userData.id,
                    userData.email,
                    userData._token,
                    tokenExpirationDate
                );

                if (loadedUser.token) {
                    const expirationDuration = tokenExpirationDate.getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration);

                    return new AuthActions.AuthenticateSuccess({
                        email: loadedUser.email,
                        userId: loadedUser.id,
                        token: loadedUser.token,
                        expirationDate: tokenExpirationDate,
                        redirect: false
                    });
                }

                return { type: 'Dummy' };
            })
        );

    @Effect({ dispatch: false })
    authLogout = this.actions$
        .pipe(
            ofType(AuthActions.LOGOUT),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
            })
        );

    setLogoutTimer = (resData: AuthResponseData) =>
        this.authService.setLogoutTimer(+resData.expiresIn * 1000)
}
