const Joi = require('joi');

const userSchema = [ 
 
]

function validateUser(user) {
    const schema = {
      first_name: Joi.string()
        .min(2)
        .max(50)
        .required(),
      last_name: Joi.string()
        .min(2)
        .max(50)
        .required(),
      email: Joi.string()
        .min(5)
        .max(255)
        .required()
        .email(),
      password: Joi.string()
        .min(5)
        .max(255)
        .required(),
      created_at: Joi.date(),
      is_admin: Joi.boolean()
    };
  
    return Joi.validate(user, schema);
  }

module.exports.User = userSchema;
module.exports.validate = validateUser;