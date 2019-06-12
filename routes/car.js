const express = require('express');
const router = express.Router();
const {Cars, validate} = require('../models/car');
const Joi = require('joi');
const auth = require('../middleware/auth');
const admin = require("../middleware/admin");
const moment = require('../helper/moment');
const response = require('../helper/response');
const resourceResponse = require('../helper/getAllResourceResponse');
const getCars = require('../middleware/getcars');
const errorResponse =  require('../helper/errorResponse');


let updatedMessage = "Successfully updated";
let errorMessage;
let notFoundCar = "Car with the given Id could not be found";

//getcars
router.get("/", [auth, getCars], async (req, res) => {
    const resource = resourceResponse(Cars);
    return res.status(200).send(resource);
})

  //get carby id
  router.get("/:car_id", auth, async (req, res) => {
    const {id} = req.user;
    const car = await Cars.find(car => car.id === parseInt(req.params.car_id));
    if(!car) return res.status(404).send(errorMessage = errorResponse(404, notFoundCar));
        
    res.status(200).send({
        id: car.id,
        owner: id,
        created_on : car.created_on,
        state: car.state,
        status : car.status,
        price : car.price,
        manufacturer : car.manufacturer,
        model : car.model,
        body_type : car.body_type,
        seller_name : car.seller_name,
        phone_no : car.phone_no
    });
})

//delete a car
router.delete("/:id", [auth, admin], async (req, res) => {
    const car = await Cars.find(car => car.id === parseInt(req.params.id));
    if(!car) return res.status(404).send(errorMessage = errorResponse(404, notFoundCar));
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
    if(!car) return res.status(404).send(errorMessage = errorResponse(404, notFoundCar));

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
   if(!car) return res.status(404).send(errorMessage = errorResponse(404, notFoundCar));

   car.status = "sold";
   const message = response(car, email, updatedMessage);
   if(message) {
       res.status(200).send(message);
   }
})

//post a car ad endpoint
router.post('/', auth, async (req, res) => {
    //get the email and id of the logged in user
   const {email , id} = req.user;

   const {state, status, price, manufacturer, model, body_type, seller_name, phone_no} = req.body;

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
       body_type : body_type,
       seller_name : seller_name,
       phone_no: phone_no
   }

        const createdCar = await Cars.push(carObj);
        if (createdCar) {
            let createdMessage = "Ad successfully posted";
            const message = response(carObj, email, createdMessage);
            if(message){
                res.status(201).send(message);
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