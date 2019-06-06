const Joi = require('joi');

const carSchema = [];


// module.exports = class Use {
//     constructor ( state, status, price, manufacturer, model, body_type) {
//         this.id = cars.length + 1;
//         this.created_on = moment(),
//         // this.owner = id;
//         this.state = state;
//         this.status = status;
//         this.price = price;
//         this.manufacturer = manufacturer;
//         this.model = model;
//         this.body_type = body_type;
//     }

//     postCar() {
//         cars.push(this);
//     }

//     static fetchAllCars() {
//       return cars;
//     }
// }


const validateCarObj = car => {
    const schema = {
        seller_name: Joi.string()
           .required(),
        phone_no : Joi.number()
           .required(),
        state: Joi.string()
          .required(),
        status: Joi.string()
          .required(),
        price: Joi.number()
          .required(),
        manufacturer: Joi.string()
           .required(),
        model: Joi.string()
           .required(),
        body_type : Joi.string()
           .required()
      };
    
      return Joi.validate(car, schema);
}

module.exports.Cars = carSchema;
module.exports.validate = validateCarObj;
