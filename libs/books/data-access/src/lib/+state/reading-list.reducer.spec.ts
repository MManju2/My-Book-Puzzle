import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('should add book to the state when addToReadingList action dispatched', () => {
      const action = ReadingListActions.addToReadingList({
        book: createBook('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(["A", "B", "C"]);
    });

    it('should remove book from state when failedAddToReadingList action dispatched', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('B')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A']);
    });

    it('should remove book from state when removeFromReadingList action dispatched', () => {
      const action = ReadingListActions.removeFromReadingList({
        item: createReadingListItem('A')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(["B"]);
    });

    it('should add book to the state when failedRemoveFromReadingList action dispatched', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B', 'C']);
    });

    it('should set the finished state as true when finishFromReadingListSuccess action dispatched', () => {
      const action = ReadingListActions.finishFromReadingListSuccess({
        item: createReadingListItem('A'), finishedDate: new Date().toISOString()
      });

      const result: State = reducer(state, action);

      expect(result.entities.A.finished).toBe(true);
    });

    it('should set the error in state when failedFinishedFromReadingList action dispatched', () => {
      const action = ReadingListActions.failedFinishedFromReadingList({
        error: 'Error'
      });

      const result: State = reducer(state, action);

      expect(result.error).toBe('Error');
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
