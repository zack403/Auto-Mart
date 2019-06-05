const Joi = require('joi');

const flagSchema = [];



const validateFlagObj = flag => {
    const schema = {
        car_id : Joi.number().required(),       
        reason : Joi.string().required(),
        description : Joi.string().required()
      };
    
      return Joi.validate(flag, schema);
}

module.exports.Flags = flagSchema;
module.exports.validate = validateFlagObj;