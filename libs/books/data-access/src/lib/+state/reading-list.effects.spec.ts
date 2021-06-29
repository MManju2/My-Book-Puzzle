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
    it('should invoke finishFromReadingListSuccess action when finish book http call succeeds', (done) => {
      const item = createReadingListItem('A');
      const finishedDate = new Date().toISOString();
      actions = new ReplaySubject();
      actions.next(
        ReadingListActions.finishFromReadingList({
          item, finishedDate
        })
      );

      effects.finishBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.finishFromReadingListSuccess({
            item, finishedDate
          })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/A/finished').flush([]);
    });

    it('should invoke failedFinishedFromReadingList action when finish book http call fails', (done) => {
      const error = 'Http failure response for /api/reading-list/A/finished: 0 ';
      actions = new ReplaySubject();
      actions.next(
        ReadingListActions.finishFromReadingList({
          item: createReadingListItem('A'),
          finishedDate: new Date().toISOString()
        })
      );

      effects.finishBook$.subscribe((action) => {
        expect(action).toEqual(
          ReadingListActions.failedFinishedFromReadingList({ error })
        );
        done();
      });

      httpMock
        .expectOne('/api/reading-list/A/finished')
        .error(new ErrorEvent('Throw Error'));
    });
  });
});
