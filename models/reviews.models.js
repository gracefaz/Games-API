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

// exports.insertCommentCount = (review_id) => {
//   return db.query(
//     `UPDATE reviews SET comment_count=$1 WHERE review_id=$2 RETURNING *`,
//     [review_id]
//   );
// };

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
