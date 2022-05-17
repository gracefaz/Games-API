const db = require("../db/connection");

exports.fetchUsers = () => {
  if (!"/api/users") {
    return Promise.reject({ status: 404, message: "Not Found" });
  }
  return db.query(`SELECT * FROM users`).then((users) => {
    return users.rows;
  });
};
