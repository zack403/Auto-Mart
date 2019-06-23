const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (id, email, firstName, isAdmin) => {
    const token = jwt.sign(
        {
          id: id,
          first_name: firstName,
          email : email,
          is_admin : isAdmin
        },
        config.get('jwtPrivateKey'), {expiresIn: '24h'}
      );
      return token;
}