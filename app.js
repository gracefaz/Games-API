const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controllers");

app.use(express.json());

app.get("/api/categories", getCategories);

app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
