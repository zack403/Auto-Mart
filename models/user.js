const Joi = require('joi');
const db = require('../startup/db');


const userSchema = [ 
 
]

  const userTable = async () => {
   const result = await db.query(`
   CREATE TABLE IF NOT EXISTS
    users(
      id SERIAL NOT NULL,
      first_name VARCHAR(128) NOT NULL,
      last_name VARCHAR(128) NOT NULL,
      email VARCHAR(128) NOT NULL,
      address VARCHAR(128) NOT NULL,
      is_admin BOOLEAN NOT NULL,
      user_image_url BIT,
      password  VARCHAR(128) NOT NULL,
      confirm_password VARCHAR(128) NOT NULL,
      created_at TIMESTAMP,
      PRIMARY KEY (id)
    )`);
    console.log(result);
  } 
  


const validateUser = user => {
    const schema = {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().min(7).alphanum().max(255).required(),
      confirm_password: Joi.string().valid(Joi.ref('password')).required().strict().min(7)
         .alphanum().max(255),
      address : Joi.string(),
      created_at: Joi.date(),
      is_admin: Joi.boolean()
    };
  
    return Joi.validate(user, schema);
  }

module.exports.User = userSchema;
module.exports.validate = validateUser;
module.exports.userTable = userTable;