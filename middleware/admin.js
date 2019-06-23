const errorResponse = require('../helper/errorResponse');

module.exports = (req, res, next) => {
  if (!req.user.is_admin) {
    const error = errorResponse(403, "Access denied.");
    return res.status(403).send(error);
  } 
  next();
};
