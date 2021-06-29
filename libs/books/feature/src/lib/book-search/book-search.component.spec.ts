import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule, createBook } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { Store } from '@ngrx/store';
import {
  BooksPartialState,
  clearSearch,
  addToReadingList,
  searchBooks
} from '@tmo/books/data-access';
import { of } from 'rxjs';

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let store: Store<BooksPartialState>;
  let fixture: ComponentFixture<BookSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should dispatch addToReadingList action when user clicked on want to read button', () => {
    const book = { ...createBook('A'), isAdded: false };
    const booksArray = [
      book, { ...createBook('B'), isAdded: true }
    ];
    jest.spyOn(store, 'dispatch');
    component.readingListBook$ = of(booksArray);
    component.searchForm.value.term = 'css';
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelectorAll(
      '[data-e2e="add-button"]'
    );
    button[0].click();

    expect(store.dispatch).toHaveBeenCalledWith(addToReadingList({ book, showSnackBar: true }));
  });

  it('should set search term and call searchbooks when default link clicked', () => {
    jest.spyOn(component, 'searchBooks');
    const defaultLink = fixture.nativeElement.querySelector(
      '[data-e2e="default-term-link"]'
    );
    defaultLink.click();
    expect(component.searchForm.value.term).toEqual('javascript');
    expect(component.searchBooks).toHaveBeenCalled();
  });

  it('should dispatch searchBooks action when searchForm value is not empty', () => {
    jest.spyOn(store, 'dispatch');
    component.searchForm.value.term = 'Angular';
    component.searchBooks();
    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: "Angular"})
    );
  });

  it('should dispatch clearSearch action when searchForm value is empty', () => {
    jest.spyOn(store, 'dispatch');
    component.searchForm.value.term = '';
    component.clearBooks();
    expect(store.dispatch).toHaveBeenCalledWith(
      clearSearch()
    );
  });
});
