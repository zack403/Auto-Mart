const Joi = require('joi');
const db = require('../startup/db');

const carTable = async () => {
   return await db.query(`
   CREATE TABLE IF NOT EXISTS
    cars(
      id SERIAL NOT NULL,
      seller_name VARCHAR(128) NOT NULL,
      phone_no VARCHAR(128) NOT NULL,
      state VARCHAR(128) NOT NULL,
      status VARCHAR(128) NOT NULL,
      price NUMERIC NOT NULL,
      manufacturer VARCHAR NOT NULL,
      car_image_url VARCHAR NOT NULL,
      model  VARCHAR(128) NOT NULL,
      body_type VARCHAR(128) NOT NULL,
      owner SERIAL NOT NULL,
      created_on TIMESTAMP NOT NULL DEFAULT NOW(),
      PRIMARY KEY (id),
      FOREIGN KEY (owner) REFERENCES users (id) ON DELETE CASCADE
    )`);
  } 

  const validateCarObj = car => {
    const schema = {
        seller_name: Joi.string()
           .required(),
        phone_no : Joi.number()
           .required(),
        state: Joi.string()
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

const carMethods =  {
  findAll: async () => {
    const text = 'SELECT * FROM cars'
    return await db.query(text);
  },
  findById: async (id) => {
    const text = 'SELECT * FROM cars where id = $1'
    return await db.query(text, [id]);
  },
  updatePrice: async (id, price) => {
    const updateQuery = `UPDATE cars
    SET price=$1 WHERE id=$2 returning *`;
    const values = [
      price,
      id
    ];
    return await db.query(updateQuery, values);
  },
  updateStatus: async (id) => {
    const updateQuery = `UPDATE cars
    SET status=$1 WHERE id=$2 returning *`;
    const values = [
      "Sold",
      id
    ];
    return await db.query(updateQuery, values);
  },
  delete: async () => {
    const text = 'DELETE FROM cars'
    return await db.query(text);
  },
  deleteCar: async (id) => {
    const text = 'DELETE FROM cars where id = $1'
    return await db.query(text, [id]);
  },
  save: async (seller_name, phone_no, state, price, 
        manufacturer, model, body_type,owner
        ) => {
      const text = `INSERT INTO
      cars(seller_name, phone_no, status, state, price, manufacturer, 
        model, body_type, car_image_url, owner)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`;
      const values = [
        seller_name,
        phone_no,
        "Available",
        state,
        price,
        manufacturer,
        model,
        body_type,
        "image",
        owner
      ]
     return await db.query(text, values);
  }
}

module.exports.Cars = carMethods;
module.exports.validate = validateCarObj;
module.exports.carTable = carTable;

