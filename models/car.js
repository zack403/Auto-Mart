const Joi = require('joi');
const db = require('../startup/db');


const carSchema = [];



const carTable = async () => {
   const result = await db.query(`
   CREATE TABLE IF NOT EXISTS
    cars(
      id SERIAL NOT NULL,
      seller_name VARCHAR(128) NOT NULL,
      phone_no VARCHAR(128) NOT NULL,
      state VARCHAR(128) NOT NULL,
      status VARCHAR(128) NOT NULL,
      price NUMERIC NOT NULL,
      manufacturer VARCHAR NOT NULL,
      car_image_url BIT NOT NULL,
      model  VARCHAR(128) NOT NULL,
      body_type VARCHAR(128) NOT NULL,
      owner SERIAL NOT NULL,
      created_on TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (owner) REFERENCES users (id) ON DELETE CASCADE
    )`);
    console.log(result);
  } 
  

// module.exports = class Use {
//     constructor ( state, status, price, manufacturer, model, body_type) {
//         this.id = cars.length + 1;
//         this.created_on = moment(),
//         // this.owner = id;
//         this.state = state;
//         this.status = status;
//         this.price = price;
//         this.manufacturer = manufacturer;
//         this.model = model;
//         this.body_type = body_type;
//     }

//     postCar() {
//         cars.push(this);
//     }

//     static fetchAllCars() {
//       return cars;
//     }
// }


const validateCarObj = car => {
    const schema = {
        seller_name: Joi.string()
           .required(),
        phone_no : Joi.number()
           .required(),
        state: Joi.string()
          .required(),
        status: Joi.string()
          .required(),
        price: Joi.number()
          .required(),
        manufacturer: Joi.string()
           .required(),
        model: Joi.string()
           .required(),
        body_type : Joi.string()
           .required()
      };
    
      return Joi.validate(car, schema);
}

module.exports.Cars = carSchema;
module.exports.validate = validateCarObj;
module.exports.carTable = carTable;

