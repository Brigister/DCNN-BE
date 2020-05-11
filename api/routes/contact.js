const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const keys = require("../../config/keys");
const db = require("../../config/connection");

router.get("/getMessages", (req, res) => {
  var sql = "SELECT * FROM messaggi WHERE risposto = 0";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({
        message: err
      });
    } else if (result == 0) {
      res.status(204).json({
        message: "You have 0 messages"
      });
    } else
      res.status(200).json({
        message: result
      });
  });
});

router.post("/postMessage", (req, res) => {
  var messageData = {
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: req.body.email,
    testo: req.body.testo
  };
  var sql = "INSERT INTO messaggi SET" + db.escape(messageData);

  db.query(sql, (err, result) => {
    if (err) {
      res.status(400).json({
        message: "Message not sended",
        err: err
      });
    } else
      res.status(200).json({
        message: "Message sended successfully",
        result: result
      });
  });
});

let transporter = nodemailer.createTransport({
  host: keys.mail.host,
  auth: {
    user: keys.mail.email,
    pass: keys.mail.password
  }
});
router.post("/sendMail", (req, res) => {
  var messageData = {
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: req.body.email,
    testo: req.body.testo
  };

  const mailOptions = {
    from: "Nodemailer " + keys.mail.email,
    to: keys.mail.email,
    subject: "ContactDCNN " + messageData.nome + " " + messageData.cognome,
    html:
      "<p>Mittente: </p>" +
      messageData.email +
      "<br>" +
      "<p>Messaggio:</p>" +
      messageData.testo
  };
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      res.status(400).json({
        message: "Mail not sended",
        err: err
      });
    } else {
      res.status(200).json({
        message: "Mail send",
        info: info
      });
    }
  });
});

module.exports = router;
