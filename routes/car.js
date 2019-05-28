const express = require('express');
const router = express.Router();
const {Cars, validate} = require('../models/car');
const auth = require('../middleware/auth');
const admin = require("../middleware/admin");
const moment = require('../helper/moment');


//getcars
router.get("/", auth, async (req, res) => {
    res.status(200).send({
        status: 200,
        data: Cars
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
    console.log(req.user);
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