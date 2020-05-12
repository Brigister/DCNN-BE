const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const db = require("../../config/connection");

router.get("/users", function (req, res) {
  let sql = "SELECT * FROM users";
  db.query(sql, function (err, results) {
    if (err) {
      console.log(err);
    }
    console.log(results);
    res.send(results);
  });
});

router.post("/signup", function (req, res) {
  //cerco se c'è un user con la mail inserita
  var findOne =
    "SELECT email FROM users WHERE email=" + db.escape(req.body.email);

  db.query(findOne, function (err, results) {
    if (err) console.log(err);
    //se c'è l'email nel database non faccio nulla
    else if (Object.keys(results).length > 0) {
      console.log("Found user with given mail");
      res.send("Found user with given mail");
    } else {
      //se non c'è l'email nel db creo un nuovo utente
      console.log(results);
      console.log("No user with given email");
      //hash della password
      var hash = bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) console.log(err);
        else {
          var user = {
            email: req.body.email,
            password: hash,
            nome: req.body.nome,
            cognome: req.body.cognome,
          };
          //inserisco il nuovo user
          let sql = "INSERT INTO users SET " + db.escape(user);
          db.query(sql, function (err, results) {
            if (err) console.log(err);
            else {
              console.log(results);
              res.send(results);
            }
          });
        }
      });
    }
  });
});

//Login
router.post("/login", function (req, res) {
  //cerco se c'è un user con la mail inserita
  var findOne = "SELECT * FROM users WHERE email=" + db.escape(req.body.email);

  db.query(findOne, function (err, results) {
    if (err) console.log(err);
    //se c'è l'email nel database procedo
    else if (Object.keys(results).length > 0) {
      console.log("Found user with given mail");
      bcrypt.compare(req.body.password, results[0].password, (err, succ) => {
        if (err) {
          console.log(err);
        }
        if (succ) {
          var token = jwt.sign(
            {
              userID: results[0].userID,
              username: results[0].username,
              email: results[0].email,
              nome: results[0].nome,
              cognome: results[0].cognome,
              powerLevel: results[0].powerLevel,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "2h",
            }
          );
          res.status(200).json({
            message: "Logging in",
            token: token,
          });
        }
        /*         res.status(401).json({
          message: "Wrong Data - Not Logged in",
        }); */
      });
    } else {
      console.log("No user with given email");
      res.status(401).json({
        message: "Wrong Data - Not Logged in",
      });
    }
  });
});
module.exports = router;
