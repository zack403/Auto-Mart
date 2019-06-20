const Joi = require('joi');
const db = require('../startup/db');


const flagSchema = [];

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

module.exports.Flags = flagSchema;
module.exports.validate = validateFlagObj;
module.exports.flagTable = flagTable;