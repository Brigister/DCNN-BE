const express = require("express");
const router = express.Router();

const checkAuth = require("./../checkAuth");

const db = require("../../config/connection");

router.get("/getMarkers", (req, res) => {
  let sql = "SELECT * FROM maps_markers";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (!result) {
      res.status(404).send("0 markers");
    } else {
      res.status(200).send(result);
    }
  });
});

router.post("/addMarker", checkAuth, (req, res) => {
  var markerData = {
    lat: req.body.lat,
    lng: req.body.lng,
    luogo: req.body.luogo,
    regione: req.body.regione,
  };
  let sql = "INSERT INTO maps_markers SET" + db.escape(markerData);

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error",
        error: err,
      });
    } else {
      res.status(200).json({
        message: "adding marker at given location",
        result: result,
      });
    }
  });
});

router.post("/importMarkers", checkAuth, (req, res) => {
  let sql =
    "INSERT INTO maps_markers (lat, lng, luogo) SELECT DISTINCT Latitudine, Longitudine, Luogo FROM eventi WHERE Luogo NOT IN (SELECT luogo from maps_markers)";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error",
        error: err,
      });
    } else {
      res.status(200).json({
        message: "adding marker at given location",
        result: result,
      });
    }
  });
});

router.delete("/deleteMarker/:id", checkAuth, (req, res) => {
  let sql = "DELETE FROM maps_markers WHERE id =" + db.escape(req.params.id);

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error",
        error: err,
      });
    } else if (!result) {
      res.status(404).json({
        message: "Marker not found by given id",
      });
    } else
      res.status(200).json({
        message: "Marker deleted",
        result: result,
      });
  });
});

router.patch("/addRegion", checkAuth, (req, res) => {
  let sql =
    "UPDATE maps_markers SET regione =" +
    db.escape(req.body.regione) +
    "WHERE id =" +
    db.escape(req.body.id);

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error",
        error: err,
      });
    }
    if (result) {
      res.status(200).json({
        message: "Region updated",
        result: result,
      });
    }
  });
});

router.get("/getRegionCount", (req, res) => {
  let sql =
    "SELECT regione, COUNT(regione) AS quantita FROM maps_markers WHERE regione IS NOT NULL GROUP BY regione";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error",
        error: err,
      });
    } else if (!result) {
      res.status(404).json({
        message: "There's no marker",
      });
    } else res.status(200).send(result);
  });
});

module.exports = router;
