import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html'
})

export class ShoppingEditComponent implements OnInit, OnDestroy {
  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<fromApp.AppState>
  ) { }


  @ViewChild('f', { static: false }) shoppingListForm: NgForm;

  editingSub: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  ngOnInit(): void {
    this.editingSub = this.store.select('shoppingList').subscribe(
      (stateData) => {
        if (stateData.editedIngredientIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;

          this.shoppingListForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount
          });
        }
        else {
          this.editMode = false;
        }
      }
    );

    // this.editingSub = this.shoppingListService.startedEditing
    //   .subscribe(
    //     (index: number) => {
    //       this.editMode = true;
    //       this.editedItemIndex = index;
    //       this.editedItem = this.shoppingListService.getIngredient(index);
    //       this.shoppingListForm.setValue({
    //         name: this.editedItem.name,
    //         amount: this.editedItem.amount
    //       });
    //     }
    //   );
  }

  onSubmit(form: NgForm): void {
    const addItemForm = form.value;
    const newIngredient = new Ingredient(addItemForm.name, addItemForm.amount);

    if (this.editMode) {
      // this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
      this.editMode = false;
    }
    else {
      // this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }

    form.reset();
  }

  onClear(): void {
    this.editMode = false;
    this.shoppingListForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete(): void {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
    // this.shoppingListService.deleteIngredient(this.editedItemIndex);
  }

  ngOnDestroy(): void {
    this.editingSub.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
