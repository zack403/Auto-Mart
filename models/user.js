const Joi = require('joi');
const db = require('../startup/db');

const userTable = async () => {
  return await db.query(`
  CREATE TABLE IF NOT EXISTS
   users(
     id SERIAL NOT NULL,
     first_name VARCHAR(128) NOT NULL,
     last_name VARCHAR(128) NOT NULL,
     email VARCHAR(128) NOT NULL,
     address VARCHAR(128) NOT NULL,
     is_admin BOOLEAN NOT NULL,
     password  VARCHAR(128) NOT NULL,
     confirm_password VARCHAR(128) NOT NULL,
     created_at TIMESTAMP NOT NULL DEFAULT NOW(),
     PRIMARY KEY (id)
   )`);
 } 

 const validateUser = user => {
   const schema = {
     first_name: Joi.string().required(),
     last_name: Joi.string().required(),
     email: Joi.string().required().email(),
     password: Joi.string().min(7).alphanum().max(255).required(),
    //  confirm_password: Joi.string().valid(Joi.ref('password')).required().strict().min(7)
    //     .alphanum().max(255),
     address : Joi.string().required(),
     created_at: Joi.date(),
     is_admin: Joi.boolean()
   };
   return Joi.validate(user, schema);
 }

const userMethods =  {
  findByEmail: async (user) => {
    const text = 'SELECT * FROM users where email = $1'
    return await db.query(text, [user]);
  },
  findById: async (id) => {
    const text = 'SELECT * FROM users where id = $1'
    return await db.query(text, [id]);
  },
  delete: async () => {
    const text = 'DELETE FROM users'
    return await db.query(text);
  },
  updateUser: async (id, password) => {
    const updateQuery = `UPDATE users
    SET password=$1,confirm_password=$1 WHERE id=$2 returning *`;
    const values = [
      password,
      id
    ];
    return await db.query(updateQuery, values);
  },
  save: async (first_name, last_name, email, address, password, confirm_password
        ) => {
      const text = `INSERT INTO
      users(first_name, last_name, email, address, is_admin, password, confirm_password)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      returning id, first_name, last_name, email, created_at`;
      const values = [
        first_name,
        last_name,
        email,
        address,
        true,
        password,
        confirm_password
      ]
     return await db.query(text, values);
  }
}

module.exports.User = userMethods;
module.exports.validate = validateUser;
module.exports.userTable = userTable;