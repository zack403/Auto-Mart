const Joi = require('joi');

const userSchema = [ 
 
]


const validateUser = user => {
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
        .required()
        .email(),
      password: Joi.string()
        .min(7)
        .alphanum()
        .max(255)
        .required(),
      confirm_password: Joi.string()
        .valid(Joi.ref('password')).required().strict()
        .min(7)
        .alphanum()
        .max(255),
      created_at: Joi.date(),
      is_admin: Joi.boolean()
    };
  
    return Joi.validate(user, schema);
  }

module.exports.User = userSchema;
module.exports.validate = validateUser;