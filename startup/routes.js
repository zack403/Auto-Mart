const express = require('express');
const users = require('../routes/user');
const auth = require('../routes/auth');
// const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/v1/auth/signup', users);
  app.use('/api/v1/auth/signin', auth);
//   app.use(error);
}