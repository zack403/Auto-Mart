const Joi = require('joi');

const userSchema = [ 
 
]


const validateUser = user => {
    const schema = {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().min(7).alphanum().max(255).required(),
      confirm_password: Joi.string().valid(Joi.ref('password')).required().strict().min(7)
         .alphanum().max(255),
      address : Joi.string(),
      created_at: Joi.date(),
      is_admin: Joi.boolean()
    };
  
    return Joi.validate(user, schema);
  }

module.exports.User = userSchema;
module.exports.validate = validateUser;