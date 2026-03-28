const db = require("../config/db");

exports.createUser = (email, hash) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hash],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};