const db = require("../db/connection");

exports.fetchCategories = () => {
  if (!"/api/categories") {
    return Promise.reject({ status: 404, message: "Not Found" });
  }
  return db.query(`SELECT * FROM categories`).then((categories) => {
    return categories.rows;
  });
};

exports.fetchReviewById = (review_id) => {
  console.log(typeof review_id, "<--- type of review_id");
  if (isNaN(review_id)) {
    return Promise.reject({
      status: 400,
      message: "The review_id does not exist.",
    });
  }
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((res) => {
      console.log(res.rows[0], "<--- res.rows[0]");
      console.log(res.rows, "<---- res.rows");
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
