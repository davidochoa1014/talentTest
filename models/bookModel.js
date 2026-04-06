const db = require("../config/db");

exports.create = (book) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO books (title, author, description) VALUES (?, ?, ?)",
      [book.title, book.author, book.description],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

exports.findAll = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM books", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM books WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

exports.update = (id, book) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE books SET title=?, author=?, description=?,  available = ?, year = ?, daily_price = ? WHERE id=?",
      [book.title, book.author, book.description, book.available, book.year, book.daily_price, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

exports.remove = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM books WHERE id=?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.toggleAvailability = (id, available) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE books SET available=? WHERE id=?",
      [available, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

exports.search = (term) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM books WHERE title LIKE ? OR author LIKE ?",
      [`%${term}%`, `%${term}%`],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};