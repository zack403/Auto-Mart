const express = require('express');
const router = express.Router();
const {Orders, validate} = require('../models/order');
const {Cars} = require('../models/car');
const auth = require('../middleware/auth');
const Joi = require('joi');
const moment = require('../helper/moment');



router.post('/', auth, async (req, res) => {
    //get the email and id of the logged in user
   const {id} = req.user;

   const { car_id, amount, status} = req.body;
   const {error} = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);

   const car = await Cars.find(car => car.id === parseInt(car_id));
   if(!car) return res.status(404).send("The car you are trying to purchase does not exist");

   
    //create the purchase order
    const poObj = {
        id : Orders.length + 1, 
        buyer : id, //which is the user id of the logged in user
        car_id : car_id,
        amount : amount,
        status : status ? status : 'Pending',
        created_on: moment()
    }

    const createdPO = await Orders.push(poObj);
    if (createdPO) {
        res.status(200).send({
            status : 200,
            data : {
                id : poObj.id,
                message: "Purchase order successful",
                car_id : poObj.car_id,
                created_on : poObj.created_on,
                status: poObj.status,
                price: car.price,
                price_offered: poObj.amount,
            }
        })
    }
})

router.patch("/:order_id/price", auth, async (req, res) => {
     
   const {error} = validateOrder(req.body);
   if(error) return res.status(400).send(error.details[0].message);

   const order = await Orders.find(order => order.id === parseInt(req.params.order_id));
   if(!order) return res.status(404).send("This purchase order does not exist");
   let old_price_offered = order.amount;
   if(order.status != 'Pending') return res.status(400).send('You can only update the price, if the order is still pending')

   order.amount = req.body.new_price;
   res.status(200).send({
       status: 200,
       data: {
           id : order.id,
           message : "Successfully updated",
           car_id: order.car_id,
           status : order.status,
           old_price_offered: old_price_offered,
           new_price_offered : req.body.new_price
       }
   })
})


const validateOrder = req => {
    const schema = {
        new_price : Joi.number().required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;