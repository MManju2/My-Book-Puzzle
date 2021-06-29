import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  searchBooks,
  getBooksError,
  BooksPartialState
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book, DefaultTerm } from '@tmo/shared/models';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent {
  readingListBook$ = this.store.select(getAllBooks);
  bookFetchError$ = this.store.select(getBooksError);

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store<BooksPartialState>,
    private readonly fb: FormBuilder
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book, showSnackBar: true }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue(DefaultTerm);
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  clearBooks() {
    !this.searchForm.value.term &&
      this.store.dispatch(clearSearch());
  }
}
