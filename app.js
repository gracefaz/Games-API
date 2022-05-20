const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controllers");
const {
  getReviewById,
  patchReviewById,
  getReviews,
  getCommentsById,
  addComment,
} = require("./controllers/reviews.controllers");
const { getUsers } = require("./controllers/users.controllers");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsById);

app.post("/api/reviews/:review_id/comments", addComment);

app.patch("/api/reviews/:review_id", patchReviewById);

app.all("/*", (req, res, next) => {
  res.status(404).send({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request: Invalid data type." });
  } else if (err.code === "23502") {
    res.status(400).send({ message: "Bad request: Missing contents." });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "The username does not exist." });
  } //else if (err.code === "something") {
  //res.status(404).send({ message: "Not found: Category does not exist" });
  //}
  else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
