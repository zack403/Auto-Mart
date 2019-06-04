const winston = require("winston");
require('express-async-errors');
const express = require("express");
const config = require("config");
const app = express();
const upload = require('./middleware/multer');
const cloudinary = require('cloudinary');
require("./config/cloudinaryConfig");


app.post("/upload", upload.single('image'), async (req, res) => {
  console.log("file", req.file);
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  res.send(result);
  
});


require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/config")();



const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
   winston.info(`Listening on port ${port}...`)
);

module.exports = server;