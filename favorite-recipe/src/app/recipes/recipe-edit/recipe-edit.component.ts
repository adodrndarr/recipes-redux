import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { DataStorageService } from '../../../app/shared/data-storage.service';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';
import { State } from '../store/recipe.reducer';
import * as RecipeActions from '../store/recipe.actions';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router,
              private dataStorageService: DataStorageService,
              private store: Store<fromApp.AppState>
  ) { }


  id: number;
  editMode = false;
  recipeForm: FormGroup;
  recipeFormGroups: FormGroup[] = [];
  private formIngredientsSub: Subscription;
  private recipeSub: Subscription;

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params.id;
          this.editMode = params.id != null;
          this.initForm();
        }
      );
  }

  private initForm(): void {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    const recipeIngredients = new FormArray([]);

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.recipeSub = this.store.select('recipes')
        .pipe(
          map((recipeState: State) => recipeState.recipes
            .find((_, index) => index === this.id))
        )
        .subscribe(recipe => {
          if (recipe) {
            recipeName = recipe.name;
            recipeImagePath = recipe.imagePath;
            recipeDescription = recipe.description;

            if (recipe.ingredients) {
              for (const ingredient of recipe.ingredients) {
                recipeIngredients.push(new FormGroup(
                  this.createControls(['name', 'amount'], [ingredient.name, ingredient.amount])
                ));
              }

              this.recipeFormGroups = recipeIngredients.value;
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });

    this.formIngredientsSub = this.recipeService.formIngredientsChanged
      .subscribe(formGroups => this.recipeFormGroups = formGroups);
  }

  private getRecipeFormValueByName(name: string): FormArray {
    return (this.recipeForm.get(name) as FormArray);
  }

  private createControls(propertyNames: string[], values: any[]): {} {
    const objWithControls = {};
    for (let i = 0; i < propertyNames.length; i++) {
      const propName = propertyNames[i];

      if (isNaN(+propName)) {
        objWithControls[propName] = new FormControl(values[i], Validators.required);
      }

      if (isNaN(+propName) === false) { // if it's a number
        objWithControls[propName] = new FormControl(values[i], [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ]);
      }
    }

    return objWithControls;
  }

  onSubmit(): void {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value.name,
    //   this.recipeForm.value.description,
    //   this.recipeForm.value.imagePath,
    //   this.recipeForm.value.ingredients);

    if (this.editMode) {
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(new RecipeActions.UpdateRecipe({
        index: this.id,
        newRecipe: this.recipeForm.value
      })
      );
    }
    else {
      // this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(new RecipeActions.AddRecipe(this.recipeForm.value));
    }

    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes());
    this.onCancel();
  }

  onAddIngredient(): void {
    const formIngredientsArray = this.getRecipeFormValueByName('ingredients');
    const newIngredientFormGroup = new FormGroup(this.createControls(['name', 'amount'], [null, null]));

    formIngredientsArray.push(newIngredientFormGroup);
    this.recipeService.formIngredientsChanged.next(formIngredientsArray.value);
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number): void {
    const formIngredientsArray = this.getRecipeFormValueByName('ingredients');
    formIngredientsArray.removeAt(index);

    this.recipeService.formIngredientsChanged.next(formIngredientsArray.value);
  }

  ngOnDestroy(): void {
    this.formIngredientsSub.unsubscribe();

    if (this.recipeSub) {
      this.recipeSub.unsubscribe();
    }
  }
}
