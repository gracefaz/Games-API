const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controllers");
const {
  getReviewById,
  patchReviewById,
} = require("./controllers/reviews.controllers");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.patch("/api/reviews/:review_id", patchReviewById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request: Invalid data type." });
  } else if (err.code === "23502") {
    res.status(400).send({ message: "Bad request: Missing contents." });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(404).send({ message: "The review_id does not exist." });
  } else {
    next(err);
  }
});

// app.use((err, req, res, next) => {
//   if (err.code) {
//     res.status(400).send({ message: "Bad request: Missing contents." });
//   } else {
//     next(err);
//   }
// });

app.all("/*", (req, res, next) => {
  res.status(404).send({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
