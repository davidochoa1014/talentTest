const mysql = require("mysql2");

/*const db = mysql.createConnection({
  host: "46.202.89.105",
  user: "library_user",
  password: "L1br4ryT3st123*",
  database: "library",
  port: 3306
});*/

// change createConnection to createPool to soppport getConnection() y transactions
const db = mysql.createPool({
   host: "46.202.89.105",
  user: "library_user",
  password: "L1br4ryT3st123*",
  database: "library",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
});


db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MariaDB:", err.message);
  } else {
    console.log("MariaDB connected through Pool");
    connection.release(); 
  }
});

module.exports = db;