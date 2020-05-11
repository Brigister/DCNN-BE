const jwt = require("jsonwebtoken");
const key = require("./../config/keys");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, key.jwt.jwtSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Access Denied",
    });
  }
};
