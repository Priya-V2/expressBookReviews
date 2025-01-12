import express from "express";
import jwt from "jsonwebtoken";
import books from "./booksdb.js";

const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "fingerprint_customer", {
      expiresIn: "1h",
    });
    req.session.token = token;
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (books[isbn]) {
    const book = books[isbn];
    if (!book.reviews) {
      book.reviews = {};
    }
    book.reviews[username] = review;
    return res
      .status(200)
      .json({ message: "Review added/modified successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!username) {
    return res.status(200).json({ message: "Review deleted successfully" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const reviews = book.reviews;
  if (reviews[username]) {
    delete reviews[username];
    return res.status(200).json({ message: "Review deleted" });
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

export { regd_users as authenticated, isValid, users };
