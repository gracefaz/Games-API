const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {
  let queryStr = `SELECT reviews.*,
  COUNT(comments.comment_id) AS comment_count 
  FROM reviews
  LEFT JOIN comments ON comments.review_id=reviews.review_id WHERE reviews.review_id=$1
  GROUP BY reviews.review_id`;
  return db.query(queryStr, [review_id]).then((res) => {
    if (!res.rows.length) {
      return Promise.reject({
        status: 404,
        message: "The review_id does not exist.",
      });
    } else {
      return res.rows[0];
    }
  });
};

exports.updateVotes = (reviewId, incVotes) => {
  return db
    .query(`UPDATE reviews SET votes=votes+$1 WHERE review_id=$2 RETURNING *`, [
      incVotes,
      reviewId,
    ])
    .then((res) => {
      if (!res.rows.length) {
        return Promise.reject({
          status: 404,
          message: "The review_id does not exist.",
        });
      } else {
        return res.rows[0];
      }
    });
};

exports.fetchReviews = () => {
  let queryStr = `SELECT reviews.*, 
  COUNT(comments.comment_id) ::INT 
  AS comment_count FROM reviews 
  LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id
  ORDER BY created_at DESC`;

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};

exports.fetchCommentsById = (review_id) => {
  let queryStr = `SELECT * FROM comments WHERE review_id=$1`;
  return db.query(queryStr, [review_id]).then((result) => {
    return result.rows;
  });
};
