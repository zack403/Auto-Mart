const Joi = require('joi');
const db = require('../startup/db');

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
           
      };
      return Joi.validate(car, schema);
}

const orderMethods =  {
  findById: async (id) => {
    const text = 'SELECT * FROM orders where id = $1'
    return await db.query(text, [id]);
  },
  updateOrderPrice: async (id, newPrice) => {
    const updateQuery = `UPDATE orders
    SET amount=$1 WHERE id=$2 returning *`;
    const values = [
      newPrice,
      id
    ];
    return await db.query(updateQuery, values);
  },
  updateOrderStatus: async (id, status) => {
    const updateQuery = `UPDATE orders
    SET status=$1 WHERE id=$2 returning *`;
    const values = [
      status,
      id
    ];
    return await db.query(updateQuery, values);
  },
  delete: async () => {
    const text = 'DELETE FROM orders'
    return await db.query(text);
  },
  save: async (buyer, car_id, amount, status) => {
      const text = `INSERT INTO
      orders(buyer, car_id, amount, status)
      VALUES($1, $2, $3, $4)
      returning *`;
      const values = [
        buyer,
        car_id,
        amount,
        status
      ]
     return await db.query(text, values);
  }
}

module.exports.Orders = orderMethods;
module.exports.validate = validateOrders;
module.exports.orderTable = orderTable;


