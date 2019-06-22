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
    const {rows} = await Cars.findAll();
    const resource = resourceResponse(rows);
    return res.status(200).send(resource);
})

  //get carby id
  router.get("/:car_id", auth, async (req, res) => {
    const {id: userID} = req.user;
    const {rows: car} = await Cars.findById(parseInt(req.params.car_id));
    if(!car[0]) return res.status(404).send(errorMessage = errorResponse(404, notFoundCar));
    
    const {id, created_on, state, status, price, manufacturer, model,
        body_type, seller_name, phone_no
    } = car[0];
    res.status(200).send({
        id,
        owner: userID,
        created_on,
        state,
        status,
        price,
        manufacturer,
        model,
        body_type,
        seller_name,
        phone_no
    });
})

//delete a car
router.delete("/:id", [auth, admin], async (req, res) => {
    const {rows: car} = await Cars.findById(parseInt(req.params.id));
    if(!car[0]) return res.status(404).send(errorMessage = errorResponse(404, notFoundCar));
    const result = await Cars.deleteCar(parseInt(req.params.id));
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
    const carID = parseInt(req.params.car_id);
   
    const {error} = validatePrice(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const {rows: car} = await Cars.findById(carID);
    if(!car[0]) return res.status(404).send(errorMessage = errorResponse(404, notFoundCar));

    const {rows: carByPrice} = await Cars.updatePrice(carID, req.body.price);
    const {id, created_on, manufacturer, model, price, state, 
        status, body_type, seller_name, phone_no } = carByPrice[0];
    const updateCarObj = {
        id, 
        created_on,
        state,
        status,
        price,
        manufacturer,
        model,
        body_type,
        seller_name,
        phone_no
    }
    const message = response(updateCarObj, email, updatedMessage);
    if(message) {
        res.status(200).send(message);
    }
})


router.patch("/:car_id/status", auth, async (req, res) => {
    //get the email and id of the logged in user
   const {email} = req.user;
   const carID = parseInt(req.params.car_id);

   const {rows: car} = await Cars.findById(carID);
   if(!car[0]) return res.status(404).send(errorMessage = errorResponse(404, notFoundCar));

   const {rows: carByStatus} = await Cars.updateStatus(carID);
   const {id, created_on, manufacturer, model, price, state, 
    status, body_type, seller_name, phone_no } = carByStatus[0];
   const updateCarObj = {
    id, 
    created_on,
    state,
    status,
    price,
    manufacturer,
    model,
    body_type,
    seller_name,
    phone_no
}
   const message = response(updateCarObj, email, updatedMessage);
   if(message) {
       res.status(200).send(message);
   }
})

//post a car ad endpoint
router.post('/', auth, async (req, res) => {
    //get the email and id of the logged in user
   const {email , id} = req.user;

   const {state, price, manufacturer, model, body_type, seller_name, phone_no} = req.body;

   const {error} = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);

    //create the car here
    const {rows: created} = await Cars.save(seller_name, phone_no, state, price, 
        manufacturer, model, body_type, id);
        if (created[0]) {
            let createdMessage = "Ad successfully posted";
            const {id, created_on, manufacturer, model, price, state, 
                status, body_type ,seller_name, phone_no } = created[0];
            const carObj = {
                id, 
                created_on,
                state,
                status,
                price,
                manufacturer,
                model,
                body_type,
                seller_name,
                phone_no
            }
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