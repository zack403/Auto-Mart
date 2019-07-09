const Joi = require('joi');
const db = require('../startup/db');

const flagTable = async () => {
  return await db.query(`
  CREATE TABLE IF NOT EXISTS
   flags(
     id SERIAL NOT NULL,
     car_id SERIAL NOT NULL,
     reason VARCHAR(128) NOT NULL,
     description VARCHAR(128) NOT NULL,
     owner SERIAL NOT NULL,
     created_on TIMESTAMP NOT NULL DEFAULT NOW(),
     PRIMARY KEY (id),
     FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE,
     FOREIGN KEY (owner) REFERENCES users (id) ON DELETE CASCADE
   )`);
 } 

const validateFlagObj = flag => {
    const schema = {
        car_id : Joi.number().integer().required(),       
        reason : Joi.string().required(),
        description : Joi.string().required()
      };
      return Joi.validate(flag, schema);
}

const flagMethods =  {
  findAll: async () => {
    const text = 'SELECT * FROM flags'
    return await db.query(text);
  },
  findById: async (id) => {
    const text = 'SELECT * FROM flags where car_id = $1'
    return await db.query(text, [id]);
  },
  delete: async () => {
    const text = 'DELETE FROM flags'
    return await db.query(text);
  },
  save: async (owner, car_id, reason, description) => {
      const text = `INSERT INTO
      flags(owner, car_id, reason, description)
      VALUES($1, $2, $3, $4)
      returning *`;
      const values = [
        owner,
        car_id,
        reason,
        description
      ]
     return await db.query(text, values);
  }
}

module.exports.Flags = flagMethods;
module.exports.validate = validateFlagObj;
module.exports.flagTable = flagTable;