*   Problems or code smells:
    
    *   While running the test cases, there were errors thrown by Reading list reducer test file as the reducer did not implement for handling failed actions for adding books and removing books.

    *   An appropriate message is not displayed when the search API does not return any books (error scenario) for certain terms.

    *   In book search component the selector getAllBooks not unsubscribed. This will lead to memory leak.

    *   Application showing previous book search data, If I remove search string and start typing without pressing enter key. It gives unpleasant user experience.


*   Accessibility issues by Lighthouse extension:

    *   The search button of the search bar does not have aria-label attribute or text in it making it hard to access.

    *   The contrast ratio between the default search text and its background is low making it hard to read.

    *   The contrast ratio between the Navbar content Reading list and its background is low making it hard to read.


*   Other accessibilitty issues:

    *   The image elements in book search component do not have alt attributes.

    *   The image elements in reading list component do not have alt attributes.

    *   The default search text `javascript` is not a link but uses anchor tag. Anchor tags must be used only for links.

    *   Added aria-label for the Want to read button and search input text box.

    *   Added role for the span tag which is implemented for `javascript` search text.


*   Improvements:

    *   The book search component subscribes the selector getAllBooks and does not handle memory leak. We can prevent memory leak issue by using async pipe instead of subscription.

    *   In the reading list, there is no need of confirmedAddToReadingList and confirmedRemoveFromReadingList since these actions not perform any task. The addToReadingList and removeFromReadingList actions handle all state changes in the frontend. We can replace all such actions with an `EMPTY` action
    
    *   we can test the behaviour of the functions which are present in book-search component and reading-list component file by adding unit test cases.

    *   In reading-list reducer file the unit test cases for add book to reading list and remove book from reading list not implemented.

    *   In book search component instead of using seperate function for formatting date we can format date by using inbuilt date pipes in html itself.
