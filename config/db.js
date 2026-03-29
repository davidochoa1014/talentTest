const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "46.202.89.105",
  user: "library_user",
  password: "L1br4ryT3st123*",
  database: "library",
  port: 3306
});

db.connect(err => {
  if (err) console.error(err);
  else console.log("MAriaDB connected");
});

module.exports = db;
