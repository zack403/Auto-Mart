const express = require('express');
const router = express.Router();
const {Cars, validate} = require('../models/car');
const auth = require('../middleware/auth');
const moment = require('../helper/moment');


//getcars
router.get("/", async (req, res) => {
    res.send(Cars);
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
       status : status,
       price : price,
       manufacturer : manufacturer,
       model : model,
       body_type : body_type
   }

        const createdCar = await Cars.push(carObj);
        if (createdCar) {
            res.status(200).send({
                status : 200,
                data : {
                    id : carObj.id,
                    email : email,
                    created_on : carObj.created_on,
                    manufacturer : carObj.manufacturer,
                    model : carObj.model,
                    price: carObj.price,
                    state: carObj.state,
                    status: carObj.status
                }
            })
        }
});

module.exports = router;