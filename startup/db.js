const { Pool } = require('pg');
const config = require('config');
const winston = require('winston');

const connectionString = config.get("db");

const pool = new Pool({
    connectionString: connectionString
})


module.exports = {
  connect: async () => {
    try {
         await pool.connect();
        winston.info('Connected to the Database', )
    } catch (error) {
        winston.info('Failed to connect to the Database', error)
    }
},
  query: (text, params) => pool.query(text, params)

}
