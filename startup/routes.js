const express = require('express');
const users = require('../routes/user');
const auth = require('../routes/auth');
const car = require('../routes/car');
const order = require('../routes/order');
const flag = require('../routes/flag')
const errorHandler = require('../middleware/error');

module.exports = app => {
  app.use(express.json());
  app.use('/api/v1/auth/signup', users);
  app.use('/api/v1/auth/signin', auth);
  app.use('/api/v1/car', car);
  app.use('/api/v1/order', order);
  app.use('/api/v1/flag', flag);
  app.use(errorHandler);
}