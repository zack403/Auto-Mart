// const winston = require("winston");
const express = require("express");
// const config = require("config");
const app = express();



require("./startup/cors")(app);
require("./startup/routes")(app);


const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
console.log(`Listening on port ${port}...`)
//   winston.info(`Listening on port ${port}...`)
);

module.exports = server;