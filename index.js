const winston = require("winston");
require('express-async-errors');
const express = require("express");
const config = require("config");
const app = express();


require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/config")();



const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
   winston.info(`Listening on port ${port}...`)
);

module.exports = server;