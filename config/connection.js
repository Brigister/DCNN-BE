const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
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
