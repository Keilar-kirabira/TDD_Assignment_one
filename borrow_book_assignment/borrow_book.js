function borrow_book(book_title, available_books) {
  if (typeof (book_title) !== "string") {
    return "Book name should always be a string";
    // return "Book name should be a string and the available books should be an array of books"
  }if (typeof (available_books) !== "object") {
    return "Available books should alway be an array"
  }
  if (available_books.includes(book_title)) {
    const index = available_books.indexOf(book_title);
    available_books.splice(index, 1);
    return `You have borrowed '${book_title}'.`;
  } else {
    return `Sorry, '${book_title}' is not available.`;
  }
}

module.exports = borrow_book;
