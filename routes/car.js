const express = require('express');
const router = express.Router();
const {Cars, validate} = require('../models/car');
const Joi = require('joi');
const auth = require('../middleware/auth');
const admin = require("../middleware/admin");
const moment = require('../helper/moment');
const response = require('../helper/response');

let updatedMessage = "Successfully updated";

//getcars
router.get("/", auth, async (req, res) => {
    const {status, max_price, min_price} = req.query;
    let cars = Cars;
    if(status && max_price && min_price) {
        cars = await cars.filter(car => car.status === status && 
            car.price <= max_price && car.price >= min_price);
        if(cars.length === 0) return res.status(404).send(`Car with the ${status} status and price range between ${min_price} and ${max_price} returns no result`);
    }
    else if(status && !(max_price || min_price) ) {
        cars = cars.filter(car => car.status === status);
        if(cars.length === 0) return res.status(404).send(`Car with the ${status} status returns no result`);
    }
    res.status(200).send({
        status: 200,
        data: cars
    })
})

  //get carby id
  router.get("/:car_id", auth, async (req, res) => {
    const { id} = req.user;
    const car = await Cars.find(car => car.id === parseInt(req.params.car_id));
    if(!car) return res.status(404).send("Car with the given Id could not be found");
        
    res.status(200).send({
        id: car.id,
        owner: id,
        created_on : car.created_on,
        state: car.state,
        status : car.status,
        price : car.price,
        manufacturer : car.manufacturer,
        model : car.model,
        body_type : car.body_type
    });
})

//delete a car
router.delete("/:id", [auth, admin], async (req, res) => {
    const car = await Cars.find(car => car.id === parseInt(req.params.id));
    if(!car) return res.status(404).send("Car with the given Id could not be found");
    const index = Cars.indexOf(car);
    const result = Cars.splice(index, 1);
    if(result) {
        res.status(200).send({
            status :200 ,
            data  : "Car Ad successfully deleted"
      })   
    }
})


router.patch("/:car_id/price", auth, async (req, res) => {
     //get the email and id of the logged in user
    const {email} = req.user;
   
    const {error} = validatePrice(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const car = await Cars.find(car => car.id === parseInt(req.params.car_id));
    if(!car) return res.status(404).send("Car with the given Id could not be found");

    car.price = req.body.price;
    const message = response(car, email, updatedMessage);
    if(message) {
        res.status(200).send(message);
    }
})


router.patch("/:car_id/status", auth, async (req, res) => {
    //get the email and id of the logged in user
   const {email} = req.user;
   const car = await Cars.find(car => car.id === parseInt(req.params.car_id));
   if(!car) return res.status(404).send("Car with the given Id could not be found");

   car.status = "sold";
   const message = response(car, email, updatedMessage);
   if(message) {
       res.status(200).send(message);
   }
})

//post a car ad endpoint
router.post('/', auth, async (req, res, next) => {
    //get the email and id of the logged in user
   const {email , id} = req.user;

   const {state, status, price, manufacturer, model, body_type} = req.body;

   const {error} = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);

    //create the car here
   const carObj = {
       id : Cars.length + 1, 
       owner : id, //which is the user id of the logged in user
       created_on : moment(),
       state : state,
       status : status ? status : 'Available',
       price : price,
       manufacturer : manufacturer,
       model : model,
       body_type : body_type
   }

        const createdCar = await Cars.push(carObj);
        if (createdCar) {
            let createdMessage = "Ad successfully posted";
            const message = response(carObj, email, createdMessage);
            if(message){
                res.status(200).send(message);
            }
        }
});

const validatePrice = req => {
    const schema = {
        price : Joi.number().required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;