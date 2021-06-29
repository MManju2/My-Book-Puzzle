import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedTestingModule, createReadingListItem } from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { Store } from '@ngrx/store';
import { removeFromReadingList, ReadingListPartialState, finishFromReadingList } from '@tmo/books/data-access';
import { of } from 'rxjs';

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

  it('should dispatch finishBookFromReadingList action when user clicked on finish icon', () => {
    const item = createReadingListItem('A');
    const itemArray = [item, createReadingListItem('B')];
    const finishedDate = expect.anything();
    jest.spyOn(store, 'dispatch');
    component.readingList$ = of(itemArray);
    fixture.detectChanges();
    const finishIcon = fixture.nativeElement.querySelectorAll(
      '[data-e2e="finish-icon"]'
    );
    finishIcon[0].click();

    expect(store.dispatch).toHaveBeenCalledWith(
      finishFromReadingList({ item, finishedDate })
    );
  });
});
