const express = require('express');
const users = require('../routes/user');
// const auth = require('../routes/auth');
// const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/auth/signup', users);
//   app.use('/auth/sigin', auth);
//   app.use(error);
}