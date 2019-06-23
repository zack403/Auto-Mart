const express = require('express');
const router = express.Router();
const {Orders, validate} = require('../models/order');
const {Cars} = require('../models/car');
const auth = require('../middleware/auth');
const Joi = require('joi');

router.post('/', auth, async (req, res) => {
   const {error} = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);
    //get the email and id of the logged in user
    const {id} = req.user;
    let { car_id, amount, status} = req.body;
    status = status ? status : 'Pending';
   //get the car user is trying to make purchase order for
   const {rows: car} = await Cars.findById(parseInt(car_id));
   if(!car[0]) return res.status(404).send("The car you are trying to purchase does not exist");
    const {rows: created} = await Orders.save(id, car_id, amount, status);
    if (created[0]) {
        const {id, car_id, created_on, status, amount} = created[0];
        res.status(200).send({
            status : 200,
            data : {
                id,
                message: "Purchase order successful",
                car_id,
                created_on,
                status,
                price: car[0].price,
                price_offered: amount,
            }
        })
    }
})

router.patch("/:order_id/price", auth, async (req, res) => {
    // validate request
   const {error} = validateOrder(req.body);
   if(error) return res.status(400).send(error.details[0].message);
   // get the id of the order you want to update
   const orderID = parseInt(req.params.order_id);
   //check the database if the order id is valid
   const {rows: order} = await Orders.findById(orderID);
   // bounce the user out if it is not a valid order
   if(!order[0]) return res.status(404).send("This purchase order does not exist");
   let oldPriceOffered = order[0].amount; // set old_price_offered to order amount
   //only the order that is pending can be updated
   if(order[0].status != 'Pending') return res.status(400).send('You can only update the price, if the order is still pending');
   //update the order here
   const {rows: updated} = await Orders.updateOrderPrice(orderID, req.body.new_price);
   if(updated[0]) {
    const {id, car_id, status, amount} = updated[0];
    res.status(200).send({
        status: 200,
        data: {
            id ,
            message : "Successfully updated",
            car_id,
            status,
            old_price_offered : oldPriceOffered,
            new_price_offered : amount
        }
    })
   }
})

const validateOrder = req => {
    const schema = {
        new_price : Joi.number().required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;