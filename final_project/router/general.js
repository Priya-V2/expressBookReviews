import express from "express";
import books from "./booksdb.js";
import { isValid, users } from "./auth_users.js";
import axios from "axios";

const public_users = express.Router();

// Get the book list available in the shop

public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/books");
    return res.status(200).json(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list" });
  }
});

// Get the book list available in the shop
// public_users.get("/", function (req, res) {
//   // Check if books object is available
//   if (books) {
//     return res.status(200).json(books);
//   } else {
//     return res.status(500).json({ message: "Error fetching book list" });
//   }
// });

// Get book details based on ISBN

public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get("http://localhost:5000/books");
    const book = response.data[isbn];
    if (book) {
      res.status(200).json(JSON.stringify(book, null, 4));
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching book details", error: error.message });
  }
});

// public_users.get("/isbn/:isbn", function (req, res) {
//   const isbn = req.params.isbn; // Retrieve ISBN from request parameters

//   // Check if the book exists in the database
//   if (books[isbn]) {
//     const bookDetails = {
//       isbn: isbn,
//       title: books[isbn].title,
//       author: books[isbn].author,
//       reviews: books[isbn].reviews, // You can include more fields if needed
//     };
//     // return res.status(200).json(JSON.stringify(bookDetails, null, 4));

//     res.status(200).json(bookDetails); // Return book details as JSON response
//   } else {
//     res.status(404).json({ message: "Book not found" }); // Handle case where book is not found
//   }
// });

// Get book details based on author

public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get("http://localhost:5000/books");
    const booksByAuthor = Object.values(response.data).filter(
      (book) => book.author === author
    );
    if (booksByAuthor.length > 0) {
      res.status(200).json(JSON.stringify(booksByAuthor, null, 4));
    } else {
      res.status(404).json({ message: "Books not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching book details", error: error.message });
  }
});

// public_users.get("/author/:author", function (req, res) {
//   const author = req.params.author;
//   const booksByAuthor = Object.values(books).filter(
//     (book) => book.author === author
//   );

//   if (booksByAuthor.length > 0) {
//     return res.status(200).json(JSON.stringify(booksByAuthor, null, 4));
//     // return res.status(200).json(booksByAuthor);
//   } else {
//     return res.status(404).json({ message: "No books found by this author" });
//   }
// });

// Get all books based on title

public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get("http://localhost:5000/books");
    const booksByTitle = Object.values(response.data).filter(
      (book) => book.title === title
    );
    if (booksByTitle.length > 0) {
      res.status(200).json(JSON.stringify(booksByTitle, null, 4));
    } else {
      res.status(404).json({ message: "Books not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching book details", error: error.message });
  }
});

// public_users.get("/title/:title", function (req, res) {
//   const title = req.params.title;
//   const booksByTitle = Object.values(books).filter(
//     (book) => book.title === title
//   );
//   if (booksByTitle.length > 0) {
//     return res.status(200).json(JSON.stringify(booksByTitle, null, 4));
//     // return res.status(200).json(booksByTitle);
//   } else {
//     return res.status(404).json({ message: "No books found by this title" });
//   }
// });

// Get book review

public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  if (books[isbn]) {
    return res.status(200).json(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//Register New User

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

export { public_users as general };
