const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moment = require('../helper/moment');
const {Flags, validate} = require('../models/flag');
const {Cars} = require('../models/car');






router.post('/', auth, async (req, res) => {
     //get the email and id of the logged in user
   const {id} = req.user;
    const {error} = validate(req.body);
     if(error) return res.status(400).send(error.details[0].message);

   const car = await Cars.find(car => car.id === parseInt(req.body.car_id));
   if(!car) return res.status(404).send("This ad does not exist");

     //create the flagged ad here
   const flagObj = {
        id : Flags.length + 1, 
        owner : id, //which is the user id of the logged in user
        created_on : moment(),
        car_id : car.id,
        reason : req.body.reason,
        description : req.body.description
    }

    const createdFlag = await Flags.push(flagObj);
    if (createdFlag) {
        res.status(200).send({
            id: flagObj.id,
            message: `Ad ${car.manufacturer} reported successfully`,
            car_id : car.id,
            reason: flagObj.reason,
            description: flagObj.description
        })
    }
});

module.exports = router;