const http = require("http");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");

const db = require("./config/connection");
const passportSetup = require("./config/passport-setup");

//requiring routes
const userRoutes = require("./api/routes/user");
const eventRoutes = require("./api/routes/event");
const contactRoutes = require("./api/routes/contact");
const albumRoutes = require("./api/routes/album");
const mapmarkersRoutes = require("./api/routes/mapmarkers");
const videoclipRoutes = require("./api/routes/videoclip");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
}); */

const corsOptions = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  preflightContinue: true,
  maxAge: 600,
};
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(passport.initialize());

app.use("/images", express.static("images"));

//using routes
app.use("/user", userRoutes);
app.use("/event", eventRoutes);
app.use("/contact", contactRoutes);
app.use("/album", albumRoutes);
app.use("/mapmarkers", mapmarkersRoutes);
app.use("/videoclip", videoclipRoutes);

//Connection to DB

server.listen(port);
