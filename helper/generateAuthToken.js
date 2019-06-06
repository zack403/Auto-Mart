const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function genereateAuthToken(id, email, firstName, isAdmin) {
    const token = jwt.sign(
        {
          id: id,
          first_name: firstName,
          email : email,
          is_admin : isAdmin
        },
        config.get('jwtPrivateKey'), {expiresIn: '1h'}
      );
      return token;
}