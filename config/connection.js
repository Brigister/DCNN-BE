const mysql = require("mysql");
const keys = require("./keys");

const db = mysql.createConnection({
  host: keys.mysql.host,
  port: "3306",
  user: keys.mysql.username,
  password: keys.mysql.password,
});

db.connect(function (err) {
  if (!err) {
    console.log("Connected to db");
  } else console.log("not Connected to db");
});

module.exports = db;
