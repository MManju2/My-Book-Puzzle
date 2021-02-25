import { TestBed } from '@angular/core/testing';
import { ReplaySubject, EMPTY } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule, MatSnackBarModule, NoopAnimationsModule],
      providers: [
        ReadingListEffects,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should work', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.init());

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
    it('should invoke EMPTY action when addToReadingList action succeeds', () => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.addToReadingList({
        book: createBook('A'), showSnackBar: false
      }));

      effects.addBook$.subscribe(action => {
        expect(action).toEqual(EMPTY);
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });

    it("shoul call openSnackBar function when showSnackBar is true", () => {
      jest.spyOn(effects, 'openSnackBar');
      actions = new ReplaySubject();
      actions.next(ReadingListActions.addToReadingList({
        book: createBook('A'), showSnackBar: true
      }));

      effects.addBook$.subscribe();
      expect(effects.openSnackBar).toHaveBeenCalledWith('Added !')
    });
  });

  describe('removeBook$', () => {
    it('should invoke EMPTY action when removeFromReadingList action succeeds', () => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.removeFromReadingList({
        item: createReadingListItem('A'), showSnackBar: false
      }));

      effects.removeBook$.subscribe(action => {
        expect(action).toEqual(EMPTY);
      });

      httpMock.expectOne('/api/reading-list/A').flush([]);
    });

    it("shoul call openSnackBar function when showSnackBar is true", () => {
      jest.spyOn(effects, 'openSnackBar');
      actions = new ReplaySubject();
      actions.next(ReadingListActions.removeFromReadingList({
        item: createReadingListItem('A'), showSnackBar: true
      }));

      effects.removeBook$.subscribe();
      expect(effects.openSnackBar).toHaveBeenCalledWith('Removed !');
    });
  });
});
