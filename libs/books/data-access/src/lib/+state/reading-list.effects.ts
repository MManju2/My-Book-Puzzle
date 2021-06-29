import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, filter, map } from 'rxjs/operators';
import { ReadingListItem, SnackBarConstants } from '@tmo/shared/models';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
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
      concatMap(({ book, showSnackBar }) =>
        this.http.post('/api/reading-list', book).pipe(
          map(() =>
            ReadingListActions.addToReadingListSuccess({ book, showSnackBar })
          ),
          catchError(() =>
            of(ReadingListActions.failedAddToReadingList({ book }))
          )
        )
      )
    )
  );

  undoAddBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingListSuccess),
      filter(({ showSnackBar }) => showSnackBar),
      concatMap(({ book }) => {
        const { id, ...rest } = book;
        return this.openSnackBar(SnackBarConstants.ADD_MESSAGE)
          .onAction()
          .pipe(
            map(() =>
              ReadingListActions.removeFromReadingList({
                item: { bookId: id, ...rest }, showSnackBar: false
              })
            )
          );
      })
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item, showSnackBar }) =>
        this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
          map(() =>
            ReadingListActions.removeFromReadingListSuccess({ item, showSnackBar })
          ),
          catchError(() =>
            of(ReadingListActions.failedRemoveFromReadingList({ item }))
          )
        )
      )
    )
  );

  undoRemoveBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingListSuccess),
      filter(({ showSnackBar }) => showSnackBar),
      concatMap(({ item }) => {
        const { bookId, ...rest } = item;
        return this.openSnackBar(SnackBarConstants.REMOVE_MESSAGE)
          .onAction()
          .pipe(
            map(() =>
              ReadingListActions.addToReadingList({
                book: { id: bookId, ...rest }, showSnackBar: false
              })
            )
          );
      })
    )
  );

  private openSnackBar(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, SnackBarConstants.ACTION, {
      duration: SnackBarConstants.DURATION,
    });
  }

  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    public snackBar: MatSnackBar
  ) {}
}
