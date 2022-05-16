const db = require("../db/connection");

exports.fetchCategories = () => {
  if (!"/api/categories") {
    return Promise.reject({ status: 404, message: "Not Found" });
  }
  return db.query(`SELECT * FROM categories`).then((categories) => {
    // console.log(categories.rows);
    return categories.rows;
  });
};
