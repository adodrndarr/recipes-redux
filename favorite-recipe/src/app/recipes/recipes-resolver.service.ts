import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';
import { map, switchMap, take } from 'rxjs/operators';
import { State } from './store/recipe.reducer';


@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService: DataStorageService,
                private recipeService: RecipeService,
                private store: Store<fromApp.AppState>,
                private actions$: Actions
    ) { }


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> | Recipe[] {
        // const recipes = this.recipeService.getRecipes();

        // if (recipes.length === 0) { return this.dataStorageService.fetchRecipes(); }
        // else { return recipes; }
        return this.store.select('recipes')
            .pipe(
                take(1),
                map((recipeState: State) => recipeState.recipes),
                switchMap((recipes: Recipe[]) => {
                    if (recipes.length === 0) {
                        this.store.dispatch(new RecipeActions.FetchRecipes());

                        return this.actions$
                            .pipe(
                                ofType(RecipeActions.SET_RECIPES),
                                take(1)
                            );
                    }
                    else {
                        return of(recipes);
                    }
                })
            );
    }
}
