import { Action } from '@ngrx/store';

import { Recipe } from '../recipe.model';


export const SET_RECIPES = '[Recipes] Set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch Recipes';
export const ADD_RECIPE = '[Recipe] Add Recipe';
export const UPDATE_RECIPE = '[Recipe] Update Recipe';
export const DELETE_RECIPE = '[Recipe] Delete Recipe';
export const STORE_RECIPES = '[Recipe] Store Recipes';

export class SetRecipes implements Action {
    constructor(public payload: Recipe[]) {}


    readonly type = SET_RECIPES;
}

export class FetchRecipes implements Action {
    readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action {
    constructor(public payload: Recipe) {}


    readonly type = ADD_RECIPE;
}

export class UpdateRecipe implements Action {
    constructor(public payload: { index: number, newRecipe: Recipe }) {}


    readonly type = UPDATE_RECIPE;
}

export class DeleteRecipe implements Action {
    constructor(public index: number) {}


    readonly type = DELETE_RECIPE;
}

export class StoreRecipes implements Action {
    readonly type = STORE_RECIPES;
}

export type RecipesActions =
    SetRecipes |
    FetchRecipes |
    AddRecipe |
    UpdateRecipe |
    DeleteRecipe |
    StoreRecipes;
