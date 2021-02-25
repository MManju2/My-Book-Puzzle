import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of, EMPTY } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, switchMap } from 'rxjs/operators';
import { ReadingListItem, SnackBarConstants } from '@tmo/shared/models';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import * as ReadingListActions from './reading-list.actions';

@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book, showSnackBar }) => {
        if (showSnackBar === true) {
          this.openSnackBar(SnackBarConstants.ADD_MESSAGE).onAction()
          .subscribe(() => {
            const { id, ...rest } = book;
            this.store.dispatch(
              ReadingListActions.removeFromReadingList({
                item: { bookId: id, ...rest },
                showSnackBar: false
              })
            )
          })
        }
        return this.http.post('/api/reading-list', book).pipe(
          switchMap(() =>
            EMPTY
          ),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      })
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, showSnackBar }) => {
        if (showSnackBar === true) {
          this.openSnackBar(SnackBarConstants.REMOVE_MESSAGE).onAction()
          .subscribe(() => {
            const { bookId, ...rest } = item;
            this.store.dispatch(
              ReadingListActions.addToReadingList({
                book: { id: bookId, ...rest },
                showSnackBar: false
              })
            )
          })
        }
        return this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          switchMap(() =>
            EMPTY
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      })
    )
  );

  openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(
      message,
      SnackBarConstants.ACTION,
      {duration: SnackBarConstants.DURATION}
    );
  }

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    public snackBar: MatSnackBar,
    private readonly store: Store
  ) {}
}
