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

exports.fetchReviews = (sort_by = "created_at", order = "DESC", category) => {
  console.log(category, "<--- category");
  order = order.toUpperCase();

  const sortByList = [
    "owner",
    "title",
    "review_id",
    "category",
    "review_img_url",
    "created_at",
    "votes",
  ];
  const orderList = ["ASC", "DESC"];

  let queryStr = `SELECT reviews.*, 
  COUNT(comments.comment_id) ::INT 
  AS comment_count FROM reviews 
  LEFT JOIN comments ON reviews.review_id = comments.review_id `;

  if (
    !sortByList.includes(sort_by) ||
    !orderList.includes(order) ||
    !isNaN(category)
  ) {
    return Promise.reject({
      status: 400,
      message: "Bad request: Invalid input.",
    });
  }

  if (category) {
    queryStr += ` WHERE category = $1 GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`;
  } else {
    queryStr += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`;
    return db.query(queryStr).then((result) => {
      console.log(result.rows, "<--- result.rows");
      if (!result.rows) {
        return Promise.reject({
          status: 404,
          message: "Not found: Category does not exist",
        });
      }
      return result.rows;
    });
  }

  return db.query(queryStr, [category]).then((result) => {
    console.log(result.rows, "<--- result.rows");
    return result.rows;
  });
};

exports.fetchCommentsById = (review_id) => {
  let queryStr = `SELECT * FROM comments WHERE review_id=$1`;
  return db
    .query(queryStr, [review_id])
    .then((result) => {
      if (!result.rows.length) {
        return exports.fetchReviewById(review_id);
      } else {
        return result.rows;
      }
    })
    .then((response) => {
      if (Array.isArray(response)) {
        return response;
      } else {
        return [];
      }
    });
};

exports.insertComment = (newComment, review_id) => {
  const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`,
      [username, body, review_id]
    )
    .then((res) => {
      return res.rows[0];
    });
};
