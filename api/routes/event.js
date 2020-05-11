const express = require("express");
const router = express.Router();
const https = require("https");
const request = require("request");
const checkAuth = require("./../checkAuth");
const db = require("../../config/connection");
const keys = require("../../config/keys");

router.post("/refreshEventi", (req, res) => {
  request.get({ url: keys.FbApi.refreshEvents }, (error, response, body) => {
    let fbEvents = JSON.parse(response.body);
    //console.log(fbEvents.events.data.length);
    for (i = 0; i < fbEvents.events.data.length; i++) {
      inserisci(fbEvents.events.data[i]);
    }

    res.status(200).send("ok");
  });
});

function inserisci(dati) {
  let event = {
    idEventi: dati.id,
    nome: dati.name,
    descrizione: dati.description,
    luogo: dati.place ? dati.place.name : null,
    data: dati.start_time.replace("T", " ").split("+", 1),
    urlfoto: dati.cover.source,
    latitudine: dati.place
      ? dati.place.location
        ? dati.place.location.latitude
        : null
      : null,
    longitudine: dati.place
      ? dati.place.location
        ? dati.place.location.longitude
        : null
      : null,
  };

  var insertEvent =
    "IF NOT EXISTS (SELECT * FROM eventi WHERE idEventi = " +
    db.escape(event.idEventi) +
    "INSERT INTO eventi SET " +
    db.escape(event);

  db.query(insertEvent, function (err, results) {
    if (err) console.log(err);
    else console.log(results);
  });
}

router.patch("/refreshCover", (req, res) => {
  request.get({ url: keys.FbApi.refreshCover }, (error, response, body) => {
    let fbEvents = JSON.parse(response.body);
    console.log(fbEvents.events.data.length);
    for (i = 0; i < fbEvents.events.data.length; i++) {
      inserisci(fbEvents.events.data[i]);
    }

    res.status(200).send("ok");
  });
});

function inserisci(dati) {
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
    "SELECT *, DATE_FORMAT(eventi.data,'%d %m %Y %H:%i') AS Formatted FROM eventi WHERE Data > CURRENT_timestamp()";

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
    "SELECT *, DATE_FORMAT(eventi.data,'%d %m %Y %H:%i') AS Formatted FROM eventi WHERE Data < CURRENT_timestamp() ORDER BY Data DESC";

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
    "SELECT *, DATE_FORMAT(eventi.data,'%d-%m-%Y %H:%i') AS Formatted FROM eventi ORDER BY Data DESC";

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
