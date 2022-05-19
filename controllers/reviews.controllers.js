const {
  fetchReviewById,
  updateVotes,
  fetchReviews,
  fetchCommentsById,
  insertComment,
} = require("../models/reviews.models");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  updateVotes(review_id, inc_votes)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  fetchReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsById = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsById(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addComment = (req, res, next) => {
  const { review_id } = req.params;
  console.log(req.body, "<--- req.body");
  insertComment(req.body, review_id)
    .then((comment) => {
      console.log(comment, "<--- comment");
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
