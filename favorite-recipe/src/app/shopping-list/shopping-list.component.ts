import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import * as ShoppingListActions from "./store/shopping-list.actions";
import * as fromApp from "../store/app.reducer";


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})

export class ShoppingListComponent implements OnInit, OnDestroy {
  constructor(
    private shoppingListService: ShoppingListService,
    private loggingService: LoggingService,
    private store: Store<fromApp.AppState>
  ) { }


  ingredientsObs: Observable<{ ingredients: Ingredient[] }>;
  ingredientsChangedSub: Subscription;

  ngOnInit(): void {
    this.ingredientsObs = this.store.select('shoppingList');

    // this.ingredients = this.shoppingListService.getIngredients();
    // this.ingredientsChangedSub = this.shoppingListService.ingredientsChanged
    //   .subscribe((ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   });

    // this.loggingService.printLog('Hello from ShoppingList Component ngOnInit()!');
  }

  onEditItem(index: number): void {
    // this.shoppingListService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy(): void {
    // this.ingredientsChangedSub.unsubscribe();
  }
}
