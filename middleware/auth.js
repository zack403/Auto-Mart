const jwt = require("jsonwebtoken");
const config = require("config");
const errorResponse = require('../helper/errorResponse');

module.exports = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token){
    const tokenError = errorResponse(401,"Access denied. No token provided.");
    return res.status(401).send(tokenError);
  } 
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    const decodedError = errorResponse(400, "Invalid token.");
    res.status(400).send(decodedError);
  }
};
