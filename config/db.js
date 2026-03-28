const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "testTalent",
  password: "123456",
  database: "library",
  port: 3306
});

db.connect(err => {
  if (err) console.error(err);
  else console.log("MAriaDB connected");
});

module.exports = db;
