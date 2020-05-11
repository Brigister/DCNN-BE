const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const checkAuth = require("./../checkAuth");
const db = require("../../config/connection");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace("\\", "/"));
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
  fileFilter: fileFilter,
});

router.get("/getAllPhotos", checkAuth, (req, res) => {
  let sql = "SELECT * FROM immagini";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        err: err,
      });
    } else if (!result) {
      res.status(204).json({
        message: "No images found",
      });
    } else {
      res.status(200).send(result);
    }
  });
});

router.get("/getVisiblePhotos", (req, res) => {
  let sql = "SELECT path_img FROM immagini WHERE isVisible = 1 ORDER BY ordine";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        err: err,
      });
    } else if (result.length == 0) {
      res.status(404).json({
        message: "No images found",
      });
    } else {
      res.status(200).send(result);
    }
  });
});

router.post("/postPhoto", checkAuth, upload.single("image"), (req, res) => {
  var image = {
    path_img: "http://localhost:3000/" + req.file.path.replace("\\", "/"),
  };

  let sql = "INSERT INTO immagini SET" + db.escape(image);

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Nope",
        err: err,
      });
    } else {
      res.status(200).json({
        message: "Saving image",
        result: result,
      });
    }
  });
});

router.patch("/:id_immagini/patchVisibility", (req, res) => {
  let sql =
    "UPDATE immagini SET isVisible = NOT isVisible WHERE id_immagini =" +
    db.escape(req.params.id_immagini);

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
    id_immagini: req.body.id_immagini,
    ordine: req.body.ordine,
  };
  let sql =
    "UPDATE immagini SET ordine = " +
    db.escape(data.ordine) +
    "WHERE id_immagini= " +
    db.escape(data.id_immagini);

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

router.delete("/deletePhoto", checkAuth, (req, res) => {
  console.log(req.body.path_img);
  let find =
    "SELECT path_img FROM immagini WHERE id_immagini=" +
    db.escape(req.body.path_img);

  /*  db.query(find, (err, result) => {
    if (err) throw err;
    else console.log(result.RowDataPacket);
  }); */
  let sql =
    "DELETE FROM immagini WHERE id_immagini=" +
    db.escape(req.params.id_immagini);

  /*   db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error",
        err: err,
      });
    } else if (result.affectedRows == 0) {
      res.status(404).json({
        message: "Given id not found",
      });
    } else {
      res.status(200).send(result);
      //fs.unlink(req.body.path);
    }
  }); */
});

module.exports = router;
