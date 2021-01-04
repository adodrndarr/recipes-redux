import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { DataStorageService } from '../../../app/shared/data-storage.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';
import { State } from '../store/recipe.reducer';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html'
})

export class RecipeDetailComponent implements OnInit {
  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private store: Store<fromApp.AppState>
  ) { }


  recipe: Recipe;
  id: number;

  ngOnInit(): void {
    // const id = this.route.snapshot.params.id; // if we don't change the component actively, while being on the same component
    // this.route.params // asynchronously subscribing to the observable,
    //   // use it when we do change the component actively, while being on the same component
    //   .subscribe(
    //     (params: Params) => {
    //       this.id = +params.id;
    //       // this.recipe = this.recipeService.getRecipe(this.id); ------ One way Observable in Observable
    //       this.store.select('recipes')
    //         .pipe(
    //           map((recipeState: State) => {
    //             return recipeState.recipes.find((_, index) => index === this.id);
    //           })
    //         )
    //         .subscribe(recipe => this.recipe = recipe);
    //     }
    //   );


    // --- Another way combining them in 1
    this.route.params
      .pipe(
        map(params => +params['id']),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipeState: State) => {
          return recipeState.recipes
            .find((_, index) => index === this.id);
        })
      )
      .subscribe(recipe => this.recipe = recipe);
  }

  onAddToShoppingList(): void {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
  }

  onDeleteRecipe(): void {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes());

    this.router.navigate(['/recipes']);
  }

  recipeHasIngredients(recipe: Recipe): boolean {
    return recipe.ingredients.length > 0;
  }
}
