const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Task 10: Get all books using async/await with Axios
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBookByISBN
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(err.status || 500).json({ message: err.message }));
});

// Task 12: Get book details based on Author using async/await with Promises
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = new Promise((resolve) => {
      const keys = Object.keys(books);
      let matched = [];
      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          matched.push(books[key]);
        }
      });
      resolve(matched);
    });

    const matchingBooks = await getBooksByAuthor;
    return res.status(200).json(matchingBooks);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve) => {
    const keys = Object.keys(books);
    let matched = [];
    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matched.push(books[key]);
      }
    });
    resolve(matched);
  });

  getBooksByTitle
    .then((matched) => res.status(200).json(matched))
    .catch((err) => res.status(500).json({ message: "Error retrieving books by title" }));
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
