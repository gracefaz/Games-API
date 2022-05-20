const { fetchDescription } = require("../models/api.models");

exports.getDescription = (req, res, next) => {
  fetchDescription()
    .then((description) => {
      res.status(200).send({ description });
    })
    .catch((err) => {
      next(err);
    });
};
