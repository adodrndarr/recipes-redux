import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';


@Injectable()
export class RecipeEffects {
    constructor(private actions$: Actions,
                private http: HttpClient,
                private dataStorageService: DataStorageService,
                private store: Store<fromApp.AppState>
    ) { }


    recipesUrl = 'https://recipe-bok-44b1d-default-rtdb.firebaseio.com/recipes.json';

    @Effect()
    fetchRecipes = this.actions$
        .pipe(
            ofType(RecipeActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http
                    .get<Recipe[]>(this.recipesUrl);
            }),
            map(recipes => {

                if (!recipes || recipes.length === 0) {
                    recipes = [];
                }

                return recipes.map(recipe => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }),
            map(recipes => new RecipeActions.SetRecipes(recipes))
        );

    @Effect({ dispatch: false })
    storeRecipes = this.actions$
            .pipe(
                ofType(RecipeActions.STORE_RECIPES),
                withLatestFrom(this.store.select('recipes')), // merges value from one observable to another
                switchMap(([actionData, recipeState]) => { // ([]) -> array destructuring syntax, stores the values in the coresponding vars
                    console.log(`Stored recipe/s: -----------------------------`);

                    return this.http.put(this.recipesUrl, recipeState.recipes);
                })
            );
}
