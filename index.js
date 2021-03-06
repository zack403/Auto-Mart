const winston = require("winston");
require('express-async-errors');
const express = require("express");
const config = require("config");
const app = express();
const upload = require('./middleware/multer');
const cloudinary = require('cloudinary');
require("./config/cloudinaryConfig");
const morgan = require('morgan');
const swaggerDocument = require('./swagger.json');
const swaggerUi = require('swagger-ui-express');
const db = require('./startup/db');
const {userTable} = require('./models/user');
const {carTable} = require('./models/car');
const {orderTable} = require('./models/order');
const {flagTable} = require('./models/flag');


//INITIATE CONNECTION TO THE DATABASE HERE, AND CREATE NECESSARY TABLES
const sync = async () => {
  try {
    await db.connect();
    await userTable(); // this has to be called first because it does not depend on any other table
    await carTable();
    await orderTable();
    await flagTable(); 
  } catch (error) {
      console.log(error);
    }
}
sync();

if(app.get('env') === 'development') {
  app.use(morgan('combined'));
  winston.info('Morgan Enabled');
}

const options = {
  explorer: true,
  customCss: '.swagger-ui .topbar { background-color: lavender }'
};

app.use(express.static('public'));

app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

app.post("/api/v1/user/upload", upload.single('image'), async (req, res) => {
  console.log("file", req.file);
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  const image = result.url;
  res.status(200).json({
    message: 'Your image has been uploaded successfully to cloudinary',
    data: {
       image
      }  
  });
  
});

require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/production")(app);

const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
   winston.info(`Listening on port ${port}...`)
);

module.exports = server;