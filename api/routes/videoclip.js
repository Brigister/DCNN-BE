const express = require("express");
const router = express.Router();

const checkAuth = require("./../checkAuth");
const db = require("../../config/connection");

router.get("/getVideoclip", checkAuth, (req, res) => {
  let sql = "SELECT *  FROM videoclip";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (!result) {
      res.status(404).send("0 videoclip");
    } else {
      res.status(200).send(result);
    }
  });
});

router.get("/getVisibleVideoclip", (req, res) => {
  let sql = "SELECT *  FROM videoclip WHERE isVisible = 1 ORDER BY ordine";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else if (!result) {
      res.status(404).send("0 videoclip");
    } else {
      res.status(200).send(result);
    }
  });
});

router.post("/addVideoclip", checkAuth, (req, res) => {
  let videoData = {
    idVideoclip: req.body.idVideoclip,
    nome: req.body.nome,
    prodotto: req.body.prodotto,
  };
  let sql = "INSERT INTO videoclip SET" + db.escape(videoData);

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error",
        error: err,
      });
    } else {
      res.status(200).json({
        message: "adding video by given video id",
        result: result,
      });
    }
  });
});

router.patch("/:id/patchVisibility", checkAuth, (req, res) => {
  let sql =
    "UPDATE videoclip SET isVisible = NOT isVisible WHERE idVideoclip =" +
    db.escape(req.params.id);

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error",
        err: err,
      });
    } else if (result.affectedRows == 0) {
      res.status(404).json({
        message: "Given id not found",
        result: result,
      });
    } else res.status(200).send(result);
  });
});

router.patch("/patchOrder", checkAuth, (req, res) => {
  let data = {
    idVideoclip: req.body.idVideoclip,
    ordine: req.body.ordine,
  };
  let sql =
    "UPDATE videoclip SET ordine = " +
    db.escape(data.ordine) +
    "WHERE idVideoclip= " +
    db.escape(data.idVideoclip);

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error",
        err: err,
      });
    } else if (result.affectedRows == 0) {
      res.status(404).json({
        message: "Given id not found",
        result: result,
      });
    } else res.status(200).send(result);
  });
});

router.delete("/:id/deleteVideoclip", checkAuth, (req, res) => {
  let sql =
    "DELETE FROM videoclip WHERE idVideoclip =" + db.escape(req.params.id);

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error",
        error: err,
      });
    } else if (!result) {
      res.status(404).json({
        message: "Videoclip not found by given id",
      });
    } else
      res.status(200).json({
        message: "Videoclip deleted",
        result: result,
      });
  });
});
module.exports = router;
