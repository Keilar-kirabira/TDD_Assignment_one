const borrow_book = require('./borrow_book');
// borrowing a book that is available
test('borrows a book that is available', () => {
  const available_books = ['Jane Eyre', 'The Alchemist', 'Little Women'];
  const message = borrow_book("The Alchemist", available_books);
  expect(message).toBe("You have borrowed 'The Alchemist'.");
  expect(available_books).toEqual(['Jane Eyre', 'Little Women']); // <- correct array
});

// Trying to borrow a book that is not available.
test("returns not available message for a missing book", () => {
  const available_books = ['Jane Eyre', 'Little Women'];
  const message = borrow_book('The Lord of the Rings', available_books);
  expect(message).toBe("Sorry, 'The Lord of the Rings' is not available.");
  expect(available_books).toEqual(['Jane Eyre', 'Little Women']);
});

// Checking that the book list updates correctly
test("updates the available_books list after borrowing", () => {
  const available_books = ['Jane Eyre', "The Alchemist"];
  borrow_book("The Alchemist", available_books);
  expect(available_books).toEqual(['Jane Eyre']);
});

// Borrowing when the list is empty
test("returns not available when the list is empty", () => {
  const available_books = [];
  const message = borrow_book("The Alchemist", available_books);
  expect(message).toBe("Sorry, 'The Alchemist' is not available.");
  expect(available_books).toEqual([]);
});

test("check that the  book name is always a string", () => {  
  const available_books = ['Jane Eyre', "The Alchemist"];
  const bookName = 10
  const message = borrow_book(bookName , available_books);
   expect(message).toBe( "Book name should always be a string");
});
//where the available books is not an array
// test("check that input if the parameter is correct", () => {
test("check that the available book is always an array", () => {  
  // const available_books = "The book";
  const available_books = 'Jane Eyre';
  const bookName = "2015"
  const message = borrow_book(bookName , available_books);
   expect(message).toBe( "Available books should alway be an array");
  // expect(message).toBe( "Book name should be a string and the available books should be an array of books");
});