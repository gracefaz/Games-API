const { fetchDescription } = require("../models/api.models");

exports.getDescription = (req, res, next) => {
  //   const { something } = req.params;
  //   console.log(something);
  fetchDescription()
    .then((description) => {
      res.status(200).send({ description });
    })
    .catch((err) => {
      next(err);
    });
};
