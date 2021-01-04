import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
    constructor(private dataStorageService: DataStorageService,
                private authService: AuthService,
                private store: Store<fromApp.AppState>
    ) { }


    userSub: Subscription;
    isAuthenticated = false;

    ngOnInit(): void {
            // this.authService.user
        this.userSub = this.store.select('auth')
            .pipe(
                map(authState => authState.user)
            )
            .subscribe(
            (user) => {
                // this.isAuthenticated = !user ? false : true;
                this.isAuthenticated = !!user; // same as the above
            }
        );
    }

    onSaveData(): void {
        // this.dataStorageService.storeRecipes();
        this.store.dispatch(new RecipeActions.StoreRecipes());
    }

    onFetchData(): void {
        // this.dataStorageService.fetchRecipes().subscribe();
        this.store.dispatch(new RecipeActions.FetchRecipes());
    }

    onLogout(): void {
        // this.authService.logout();
        this.store.dispatch(new AuthActions.Logout());
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}
