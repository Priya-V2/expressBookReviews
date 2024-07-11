import express from "express";
import session from "express-session";
import jwt from "jsonwebtoken";
import { authenticated as customer_routes } from "./router/auth_users.js";
import books from "./router/booksdb.js";
import { general as genl_routes } from "./router/general.js";

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  const token = req.session.token;
  if (token) {
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/books", (req, res) => {
  res.status(200).json(books);
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
