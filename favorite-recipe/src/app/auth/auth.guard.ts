import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import * as fromApp from "../store/app.reducer";


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        boolean |
        UrlTree |
        Observable<boolean | UrlTree> |
        Promise<boolean | UrlTree> {
            // this.authService.user
        return this.store.select('auth')
            .pipe(
                take(1), // Take latest user value and unsubscribe
                map(authState => authState.user),
                map(user => {
                    const isAuthenticated = !!user;
                    if (!isAuthenticated) {
                        return this.router.createUrlTree(['/auth']);
                    }

                    return true;
                })
                // tap(isAuth => { -- Older approach
                //     if (!isAuth) {
                //         this.router.navigate(['/auth']);
                //     }
                // })
            );
    }


}
