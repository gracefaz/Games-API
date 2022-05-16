const express = require("express");
const app = express();
const {
  getCategories,
  getReviewById,
} = require("./controllers/categories.controllers");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.use((err, req, res, next) => {
  if (err) {
    res.status(404).send({ message: "The review_id does not exist." });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(400).send({ message: "Bad request: Invalid data type." });
  } else {
    next(err);
  }
});

app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
