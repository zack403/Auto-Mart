const Joi = require('joi');

const orders = [];


const validateOrders = car => {
    const schema = {
        buyer: Joi.number(),
        car_id: Joi.number()
          .required(),
        amount: Joi.number()
          .required(),
        status: Joi.string()
           .required()
      };
    
      return Joi.validate(car, schema);
}

module.exports.Orders = orders;
module.exports.validate = validateOrders;

