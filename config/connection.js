const mysql = require("mysql");
const keys = require("./keys");

const db = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: keys.mysql.password,
  database: keys.mysql.database
});

db.connect(function(err) {
  if (!err) {
    console.log("Connected to db");
  } else console.log("not Connected to db");
});

module.exports = db;
