const db = require('./startup/db');


module.exports = async function createTables(){
    await db.query(`
  CREATE TABLE IF NOT EXISTS
   users(
     id SERIAL PRIMARY KEY,
     first_name VARCHAR(128) NOT NULL,
     last_name VARCHAR(128) NOT NULL,
     email VARCHAR(128) NOT NULL,
     address VARCHAR(128) NOT NULL,
     is_admin BOOLEAN NOT NULL,
     password  VARCHAR(128) NOT NULL,
     confirm_password VARCHAR(128) NOT NULL,
     created_at DATE NOT NULL DEFAULT CURRENT_DATE
   )`);

    await db.query(`
   CREATE TABLE IF NOT EXISTS
    cars(
      id SERIAL PRIMARY KEY,
      seller_name VARCHAR(128) NOT NULL,
      phone_no VARCHAR(128) NOT NULL,
      state VARCHAR(128) NOT NULL,
      seller_email VARCHAR(128) NOT NULL,
      status VARCHAR(128) NOT NULL,
      price NUMERIC NOT NULL,
      manufacturer VARCHAR NOT NULL,
      car_image_url VARCHAR NOT NULL,
      model  VARCHAR(128) NOT NULL,
      body_type VARCHAR(128) NOT NULL,
      owner SERIAL NOT NULL,
      created_on DATE NOT NULL DEFAULT CURRENT_DATE,
      CONSTRAINT cars_owner_fkey FOREIGN KEY (owner) REFERENCES users (id) ON DELETE CASCADE
    )`);

     await db.query(`
  CREATE TABLE IF NOT EXISTS
   orders(
     id SERIAL PRIMARY KEY,
     buyer_id SERIAL NOT NULL,
     car_id SERIAL NOT NULL,
     buyer_name VARCHAR(128) NOT NULL,
     buyer_phone_no VARCHAR(128) NOT NULL,
     amount NUMERIC NOT NULL,
     status VARCHAR(128) NOT NULL,
     created_on DATE NOT NULL DEFAULT CURRENT_DATE,
     CONSTRAINT orders_car_id_fkey FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE,
     CONSTRAINT orders_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES users (id) ON DELETE CASCADE

   )`);

   await db.query(`
  CREATE TABLE IF NOT EXISTS
   flags(
     id SERIAL PRIMARY KEY,
     car_id SERIAL NOT NULL,
     reason VARCHAR(128) NOT NULL,
     description VARCHAR(128) NOT NULL,
     owner SERIAL NOT NULL,
     created_on DATE NOT NULL DEFAULT CURRENT_DATE,
     CONSTRAINT flags_car_id_fkey FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE,
     CONSTRAINT flags_owner_fkey FOREIGN KEY (owner) REFERENCES users (id) ON DELETE CASCADE
   )`);

   return;
}