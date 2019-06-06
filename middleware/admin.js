const errorResponse = require('../helper/errorResponse');

module.exports = function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  // if (!config.get("requiresAuth")) return next();
  if (!req.user.is_admin) {
    const error = errorResponse(403, "Access denied.");
    return res.status(403).send(error);
  } 
  next();
};
