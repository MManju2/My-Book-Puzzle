import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule, createBook } from '@tmo/shared/testing';
import { By } from '@angular/platform-browser';
import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import { Store } from '@ngrx/store';
import {
  BooksPartialState,
  clearSearch,
  addToReadingList,
  searchBooks
} from '@tmo/books/data-access';

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

  it('should not call searchBooks function before 500ms even user typed something', fakeAsync(() => {
    jest.spyOn(component, 'searchBooks');
    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-e2e="input-field"]')
    ).nativeElement;
    inputElement.value = 'java';
    inputElement.dispatchEvent(new Event('input'));
    tick(400);

    expect(component.searchBooks).not.toHaveBeenCalled();
    fixture.destroy();
  }));

  it('should dispatch searchBooks action when the input field of the form has some text after 500ms', fakeAsync(() => {
    jest.spyOn(store, 'dispatch');
    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-e2e="input-field"]')
    ).nativeElement;
    inputElement.value = 'salesforce admin';
    inputElement.dispatchEvent(new Event('input'));
    tick(500);

    expect(store.dispatch).toHaveBeenCalledWith(
      searchBooks({ term: 'salesforce admin' })
    );
    fixture.destroy();
  }));

  it('should dispatch clearSearch action when the input field of the form is empty', fakeAsync(() => {
    jest.spyOn(store, 'dispatch');
    const inputElement: HTMLInputElement = fixture.debugElement.query(
      By.css('[data-e2e="input-field"]')
    ).nativeElement;
    inputElement.value = '';
    inputElement.dispatchEvent(new Event('input'));
    tick(500);

    expect(store.dispatch).toHaveBeenCalledWith(clearSearch());
    fixture.destroy();
  }));

  it('should dispatch addToReadingList action when addBookToReadingList function called', () => {
    jest.spyOn(store, 'dispatch');
    const book = createBook('A');
    component.addBookToReadingList(book);
    expect(store.dispatch).toHaveBeenCalledWith(addToReadingList({ book }));
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
