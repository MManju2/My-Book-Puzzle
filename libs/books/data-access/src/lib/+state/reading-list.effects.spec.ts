import { TestBed } from '@angular/core/testing';
import { ReplaySubject, EMPTY } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { SharedTestingModule, createReadingListItem } from '@tmo/shared/testing';
import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
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

  describe('finishBook$', () => {
    it('should invoke EMPTY action when finishFromReadingList action succeeds', () => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.finishFromReadingList({
        item: createReadingListItem('A'), finishedDate: new Date().toISOString()
      }));

      effects.finishBook$.subscribe(action => {
        expect(action).toEqual(EMPTY);
      });

      httpMock.expectOne('/api/reading-list/A/finished').flush([]);
    });

    it('should invoke failedFinishedFromReadingList action when http call fails', done => {
      const item = createReadingListItem('A');
      actions = new ReplaySubject();
      actions.next(ReadingListActions.finishFromReadingList({
        item, finishedDate: new Date().toISOString()
      }))

      effects.finishBook$.subscribe(action => {
        expect(action).toEqual(
          ReadingListActions.failedFinishedFromReadingList({
            item, finishedDate: ''
          })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/A/finished').error(
        new ErrorEvent('Throw Error')
      );
    });
  });
});
