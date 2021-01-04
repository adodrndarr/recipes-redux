import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';


export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
};

export function recipeReducer(state = initialState, action: RecipeActions.RecipesActions): State {
    switch (action.type) {
        case RecipeActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case RecipeActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case RecipeActions.UPDATE_RECIPE:
            const index = action.payload.index;
            const updatedRecipe = {
                ...state.recipes[index],
                ...action.payload.newRecipe
            };

            const updatedRecipes = [...state.recipes];
            updatedRecipes[index] = updatedRecipe;
            return {
                ...state,
                recipes: updatedRecipes
            };
        case RecipeActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes
                    .filter((_, recipeindex) => recipeindex !== action.index)
                ]
            };
        default:
            return state;
    }
}
