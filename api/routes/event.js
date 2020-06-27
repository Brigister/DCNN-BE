const express = require("express");
const router = express.Router();
const request = require("request");
const checkAuth = require("./../checkAuth");

require("dotenv").config();
const db = require("../../config/connection");

router.post("/refreshEventi", checkAuth, (req, res) => {

  request.get({ url: process.env.refreshEvents }, (error, response, body) => {
    let fbEvents = JSON.parse(response.body);
    let dati = fbEvents.events;
    let eventsArr = [];

    for (i = 0; i < fbEvents.events.data.length; i++) {
      eventsArr.push([
        dati.data[i].id,
        dati.data[i].name,
        dati.data[i].description,
        dati.data[i].place ? dati.data[i].place.name : null,
        dati.data[i].start_time,
        dati.data[i].cover.source,
        dati.data[i].place
          ? dati.data[i].place.location
            ? dati.data[i].place.location.latitude
            : null
          : null,
        dati.data[i].place
          ? dati.data[i].place.location
            ? dati.data[i].place.location.longitude
            : null
          : null,
      ]);
    }

    let sql = "INSERT IGNORE INTO eventi VALUES ?";

    db.query(sql, [eventsArr], function (err, results) {
      if (err) res.send(err);
      else res.send(results);
    });
  });


});

router.patch("/refreshCover", checkAuth, (req, res) => {
  request.get({ url: process.env.refreshCover }, (error, response, body) => {
    let fbEvents = JSON.parse(response.body);
    console.log(fbEvents.events.data.length);
    for (i = 0; i < fbEvents.events.data.length; i++) {
      updateCover(fbEvents.events.data[i]);
    }

    res.status(200).send("ok");
  });
});

function updateCover(dati) {
  console.log(dati);
  let updateCover =
    "UPDATE eventi SET UrlFoto = " +
    db.escape(dati.cover.source) +
    "WHERE idEventi = " +
    db.escape(dati.id);

  db.query(updateCover, function (err, results) {
    if (err) console.log(err);
    else console.log(results);
  });
}

router.get("/activeEvent", (req, res) => {
  var activeEvent =
    "SELECT *, DATE_FORMAT(eventi.data,'%d/%m/%Y %H:%i') AS Formatted FROM eventi WHERE Data > CURRENT_timestamp()";

  db.query(activeEvent, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result == 0) {
        res.status(204).json({
          message: "No planned events",
        });
      } else {
        res.send(result);
      }
    }
  });
});

router.get("/getFirst3Events", (req, res) => {
  var activeEvent =
    "SELECT *, DATE_FORMAT(eventi.data,'%d/%m/%Y %H:%i') AS Formatted FROM eventi WHERE Data > CURRENT_timestamp() LIMIT 3";

  db.query(activeEvent, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result == 0) {
        res.status(204).json({
          message: "No planned events",
        });
      } else {
        res.send(result);
      }
    }
  });
});

router.get("/eventHistory", (req, res) => {
  var sql =
    "SELECT *, DATE_FORMAT(eventi.data,'%d/%m/%Y %H:%i') AS Formatted FROM eventi WHERE Data < CURRENT_timestamp() ORDER BY Data DESC";

  db.query(sql, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result == 0) {
        res.send("Empty history");
      } else {
        res.send(result);
      }
    }
  });
});

router.get("/allEvents", checkAuth, (req, res) => {
  var activeEvent =
    "SELECT *, DATE_FORMAT(eventi.data,'%d/%m/%Y %H:%i') AS Formatted FROM eventi ORDER BY Data DESC";

  db.query(activeEvent, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      if (result == 0) {
        res.send("Empty history");
      } else {
        res.send(result);
      }
    }
  });
});

router.patch("/patchDescription", checkAuth, (req, res) => {
  var eventData = {
    idEventi: req.body.idEventi,
    descrizione: req.body.descrizione,
  };
  var sql =
    "UPDATE eventi SET Descrizione =" +
    db.escape(eventData.descrizione) +
    "WHERE idEventi =" +
    db.escape(eventData.idEventi);

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error",
        error: err,
      });
    } else if (!result) {
      res.status(404).send("Event by given idEventi not found");
    } else
      res.status(200).json({
        message: "Description patched",
        result: result,
      });
  });
});
router.delete("/:id/deleteEvent", checkAuth, (req, res) => {
  var deleteEvent =
    "DELETE FROM eventi WHERE idEventi = " + db.escape(req.params.id);

  db.query(deleteEvent, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

module.exports = router;
