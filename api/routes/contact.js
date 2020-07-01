const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

require("dotenv").config();
const db = require("../../config/connection");

router.get("/getMessages", (req, res) => {
  var sql = "SELECT * FROM messaggi WHERE risposto = 0";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({
        message: err,
      });
    } else if (result == 0) {
      res.status(204).json({
        message: "You have 0 messages",
      });
    } else
      res.status(200).json({
        message: result,
      });
  });
});

router.post("/postMessage", (req, res) => {
  var messageData = {
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: req.body.email,
    testo: req.body.testo,
  };
  var sql = "INSERT INTO messaggi SET" + db.escape(messageData);

  db.query(sql, (err, result) => {
    if (err) {
      res.status(400).json({
        message: "Message not sended",
        err: err,
      });
    } else
      res.status(200).json({
        message: "Message sended successfully",
        result: result,
      });
  });
});

let transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
router.post("/sendMail", (req, res) => {
  var messageData = {
    nome: req.body.nome,
    cognome: req.body.cognome,
    email: req.body.email,
    testo: req.body.testo,
  };

  console.log(messageData);
  const mailOptions = {
    from: "Nodemailer " + process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "ContactDCNN " + messageData.nome + " " + messageData.cognome,
    html:
      "<p>Mittente: </p>" +
      messageData.email +
      "<br>" +
      "<p>Messaggio:</p>" +
      messageData.testo,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      res.status(400).json({
        message: "Mail not sended",
        err: err,
      });
    } else {
      res.status(200).json({
        message: "Mail send",
        info: info,
      });
    }
  });
});

module.exports = router;
