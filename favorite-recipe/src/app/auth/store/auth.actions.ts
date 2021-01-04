import { Action } from '@ngrx/store';


export const AUTO_LOGIN = '[Auth] Auto Login';
export const SIGNUP_START = '[Auth] Signup Start';
export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const LOGOUT = '[Auth] Logout';
export const CLEAR_ERROR = '[Auth] Clear Error';

export class AuthenticateSuccess implements Action {
    constructor(public payload:
        {
            email: string;
            userId: string;
            token: string;
            expirationDate: Date;
            redirect: boolean;
        }
    ) { }


    readonly type = AUTHENTICATE_SUCCESS;
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginStart implements Action {
    constructor(public payload: { email: string, password: string }) { }


    readonly type = LOGIN_START;
}

export class AuthenticateFail implements Action {
    constructor(public payload: string) { }


    readonly type = AUTHENTICATE_FAIL;
}

export class SignupStart implements Action {
    constructor(public payload: { email: string, password: string }) { }


    readonly type = SIGNUP_START;
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}



export type AuthActions =
    AuthenticateSuccess |
    Logout |
    LoginStart |
    AuthenticateFail |
    SignupStart |
    ClearError |
    AutoLogin;
