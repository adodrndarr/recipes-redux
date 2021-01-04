import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';
import { Ingredient } from './ingredient.model';


@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService,
                private store: Store<fromApp.AppState>) { }


    recipesUrl = 'https://recipe-bok-44b1d-default-rtdb.firebaseio.com/recipes.json';
    storeRecipes(): void {
        let recipes: Recipe[];
        this.store.select('recipes')
            .subscribe(recipeState => {
                recipes = recipeState.recipes;
            });

        this.http.put(this.recipesUrl, recipes)
            .subscribe((response) => {
                // console.log(response);
                console.log(`Not possiblje xD`);
            });
    }

    fetchRecipes(): Observable<any> {
        // this.authService.user.subscribe().unsubscribe(); -- instead of this
        return this.http
            .get<Recipe[]>(this.recipesUrl)
            .pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {
                            ...recipe,
                            ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }),
                tap((recipes) => {
                    // this.recipeService.setRecipe(recipes);
                    this.store.dispatch(new RecipeActions.SetRecipes(recipes));
                })
            );
    }

    // initializeRecipes(): Recipe[] {
    //     return [
    //         new Recipe(
    //         'Please add a Recipe',
    //         'It will be displayed over here',
    //         'https://th.bing.com/th/id/OIP.qmbkst9oa8eD1-eocWFMXwHaEz?w=284&h=184&c=7&o=5&pid=1.7',
    //         [
    //             new Ingredient('Example Recipe', 1)
    //         ])
    //     ];
    // }
}
