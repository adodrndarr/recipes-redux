import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';


export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT = '[Shopping List] Start Edit';
export const STOP_EDIT = '[Shopping List] Stop Edit';

export class AddIngredient implements Action {
    constructor(public payload: Ingredient) { }


    readonly type = ADD_INGREDIENT;
}

export class AddIngredients implements Action {
    constructor(public payload: Ingredient[]) { }


    readonly type = ADD_INGREDIENTS;
}

export class UpdateIngredient implements Action {
    constructor(public newIngredient: Ingredient) { }


    readonly type = UPDATE_INGREDIENT;
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;
}

export class StartEdit implements Action {
    constructor(public index: number) { }

    readonly type = START_EDIT;
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT;
}

export type ShoppingListActions =
    AddIngredient |
    AddIngredients |
    UpdateIngredient |
    DeleteIngredient |
    StartEdit | 
    StopEdit;