const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

db.connect(function (err) {
  if (!err) {
    console.log("Connected to db");
  } else console.log("not Connected to db");
});

db.on("error", () => {
  db.connect();
});
module.exports = db;
