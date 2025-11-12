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