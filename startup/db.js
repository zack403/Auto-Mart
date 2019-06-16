const {Pool} = require('pg');
const config = require('config');
const winston = require("winston");

const connectionString = config.get("db");

const pool = new Pool({
    connectionString: connectionString,
    ssl: true
})

module.exports = () => pool.connect()
    .then(() => winston.info('Connected to the Database...'))
    .catch(err => winston.info('Failed to connect to the Database', err));