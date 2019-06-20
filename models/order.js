const Joi = require('joi');
const db = require('../startup/db');


const orders = [];


const orderTable = async () => {
  return await db.query(`
  CREATE TABLE IF NOT EXISTS
   orders(
     id SERIAL NOT NULL,
     buyer SERIAL NOT NULL,
     car_id SERIAL NOT NULL,
     amount NUMERIC NOT NULL,
     status VARCHAR(128) NOT NULL,
     created_on TIMESTAMP NOT NULL DEFAULT NOW(),
     price_offered NUMERIC NOT NULL,
     PRIMARY KEY (id),
     FOREIGN KEY (car_id) REFERENCES cars (id),
     FOREIGN KEY (buyer) REFERENCES users (id) ON DELETE CASCADE
   )`);
 } 

const validateOrders = car => {
    const schema = {
        buyer: Joi.number().integer(),
        car_id: Joi.number()
          .integer()
          .required(),
        amount: Joi.number()
          .required(),
        status: Joi.string()
           .required()
      };
    
      return Joi.validate(car, schema);
}

module.exports.Orders = orders;
module.exports.validate = validateOrders;
module.exports.orderTable = orderTable;


