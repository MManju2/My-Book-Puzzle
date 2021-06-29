import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import {
  SharedTestingModule,
  createBook,
  createReadingListItem
} from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Action } from '@ngrx/store';

describe('ToReadEffects', () => {
  let actions: Observable<Action>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;
  let snackbar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, MatSnackBarModule, NoopAnimationsModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore(),
        {
          provide: MatSnackBar,
          useValue: { open: () => ({ onAction: () => actions }) }
        }
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
    snackbar = TestBed.inject(MatSnackBar);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = of(ReadingListActions.init());

      effects.loadReadingList$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
  });

  describe('addBook$', () => {
    it('should invoke addToReadingListSuccess action when add book http call succeeds', (done) => {
      const book = createBook('A');
      actions = of(
        ReadingListActions.addToReadingList({
          book, showSnackBar: false
        })
      );

      effects.addBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.addToReadingListSuccess({
            book, showSnackBar: false
          })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });

    it('should invoke failedFinishedFromReadingList action when add book http call fails', (done) => {
      const book = createBook('B');
      actions = of(
        ReadingListActions.addToReadingList({
          book, showSnackBar: false
        })
      );

      effects.addBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedAddToReadingList({ book })
        );
        done();
      });

      httpMock
        .expectOne('/api/reading-list')
        .error(new ErrorEvent('Throw Error'));
    });
  });

  describe('undoAddBook$', () => {
    it('should open the snackbar with Added message and invoke removeFromReadingList action when showSnackBar is true', (done) => {
      const item = createReadingListItem('A');
      jest.spyOn(snackbar, 'open');
      actions = of(
        ReadingListActions.addToReadingListSuccess({
          book: createBook('A'), showSnackBar: true
        })
      );

      effects.undoAddBook$.subscribe((action) => {
        expect(snackbar.open).toHaveBeenCalledWith('Added !', 'Undo', {
          duration: 2000
        });
        expect(action).toEqual(
          ReadingListActions.removeFromReadingList({
            item, showSnackBar: false
          })
        );
        done();
      });
    });
  });

  describe('removeBook$', () => {
    it('should invoke removeFromReadingListSuccess action when remove book http call succeeds', (done) => {
      const item = createReadingListItem('A');
      actions = of(
        ReadingListActions.removeFromReadingList({
          item, showSnackBar: false
        })
      );

      effects.removeBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.removeFromReadingListSuccess({
            item, showSnackBar: false
          })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/A').flush([]);
    });

    it('should invoke failedFinishedFromReadingList action when remove book http call fails', (done) => {
      const item = createReadingListItem('B');
      actions = of(
        ReadingListActions.removeFromReadingList({
          item, showSnackBar: true
        })
      );

      effects.removeBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedRemoveFromReadingList({ item })
        );
        done();
      });

      httpMock
        .expectOne('/api/reading-list/B')
        .error(new ErrorEvent('Throw Error'));
    });
  });

  describe('undoRemoveBook$', () => {
    it('should open the snackbar with Removed message and invoke addToReadingList action when showSnackBar is true', (done) => {
      const book = createBook('B')
      jest.spyOn(snackbar, 'open');
      actions = of(
        ReadingListActions.removeFromReadingListSuccess({
          item: createReadingListItem('B'), showSnackBar: true
        })
      );

      effects.undoRemoveBook$.subscribe((action) => {
        expect(snackbar.open).toHaveBeenCalledWith('Removed !', 'Undo', {
          duration: 2000
        });
        expect(action).toEqual(
          ReadingListActions.addToReadingList({
            book, showSnackBar: false
          })
        );
        done();
      });
    });
  });
});
