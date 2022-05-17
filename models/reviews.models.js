const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
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

// Here the id is the number, eg which review object we want. The request body is {inc_votes: newVote}
exports.updateVotes = (reviewId, incVotes) => {
  console.log(reviewId);
  console.log(incVotes);
  return db
    .query(`UPDATE reviews SET votes=votes+$1 WHERE review_id=$2 RETURNING *`, [
      incVotes,
      reviewId,
    ])
    .then((res) => {
      console.log(res.rows[0]);
      return res.rows[0];
    });
};
