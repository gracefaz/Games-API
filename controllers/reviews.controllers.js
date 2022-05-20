const {
  fetchReviewById,
  updateVotes,
  fetchReviews,
  fetchCommentsById,
  insertComment,
  deleteComment,
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
  const { sort_by, order, category } = req.query;

  fetchReviews(sort_by, order, category)
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
  fetchReviewById(review_id)
    .then(() => {
      return insertComment(req.body, review_id);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeComment = (req, res, next) => {
  const removedComment = req.params.comment_id;
  deleteComment(removedComment)
    .then((comment) => {
      res.status(204).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
