import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';


export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
    ],
    editedIngredient: null,
    editedIngredientIndex: -1
};

export function shoppingListReducer(
    state: State = initialState,
    action: ShoppingListActions.ShoppingListActions
): State {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return { // replaces the old state of the application with a new one
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            const indexToUpdate = state.editedIngredientIndex;
            const ingredient = state.ingredients[indexToUpdate];
            const updatedIngredient = {
                ...ingredient,
                ...action.newIngredient
            };

            const updatedIngredients = [...state.ingredients];
            updatedIngredients[indexToUpdate] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            const ingredients = [...state.ingredients];
            const newIngredients = ingredients.filter((_, index) => index !== state.editedIngredientIndex);

            return {
                ...state,
                ingredients: [...newIngredients],
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.index,
                editedIngredient: { ...state.ingredients[action.index] }
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        default:
            return {
                ...state
            }
    }
}

