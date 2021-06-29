import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule, createReadingListItem } from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import { Store } from '@ngrx/store';
import { removeFromReadingList, ReadingListPartialState } from '@tmo/books/data-access';
import { of } from 'rxjs';

describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let store: Store<ReadingListPartialState>;
  let fixture: ComponentFixture<ReadingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule,SharedTestingModule]
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

  it('should dispatch removeFromReadingList action when user clicked on remove icon in reading list', () => {
    const item = createReadingListItem('B');
    const itemArray = [createReadingListItem('A'), item];
    jest.spyOn(store, 'dispatch');
    component.readingList$ = of(itemArray);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelectorAll(
      '[data-e2e="remove-button"]'
    );
    button[1].click();

    expect(store.dispatch).toHaveBeenCalledWith(
      removeFromReadingList({ item, showSnackBar: true })
    );
  });
});
