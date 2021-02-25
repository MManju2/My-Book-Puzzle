import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestingModule, createReadingListItem } from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { Store } from '@ngrx/store';
import { removeFromReadingList, ReadingListPartialState, finishFromReadingList } from '@tmo/books/data-access';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let store: Store<ReadingListPartialState>;
  let fixture: ComponentFixture<ReadingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch removeFromReadingList action when removeFromReadingList function called', () => {
    jest.spyOn(store, 'dispatch');
    const item = createReadingListItem('A');
    component.removeFromReadingList(item);
    expect(store.dispatch).toHaveBeenCalledWith(removeFromReadingList({ item }));
  });

  it('should dispatch an action when finishBookFromReadingList function called', () => {
    jest.spyOn(store, 'dispatch');
    const item = createReadingListItem('B');
    const finishedDate = new Date().toISOString();
    component.finishBookFromReadingList(item);
    expect(store.dispatch).toHaveBeenCalledWith(
      finishFromReadingList({ item, finishedDate })
    );
  });
});
