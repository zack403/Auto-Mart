const express = require('express');
const router = express.Router();
const {Orders, validate} = require('../models/order');
const {Cars} = require('../models/car');
const auth = require('../middleware/auth');
const Joi = require('joi');
const resourceResponse = require('../helper/getAllResourceResponse');
const errorResponse = require('../helper/errorResponse');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const config = require('config');


const transporter = nodemailer.createTransport(sgTransport({
    auth: {
      api_key: config.get('sendgrid_key'),
    },
  }));
  
let clientError;

router.get("/:id", auth, async (req, res) => {
    const {rows: order} = await Orders.findMyOrder(parseInt(req.params.id));
    if(order.length <= 0) return res.status(404).send(errorMessage = errorResponse(404, "You have no Orders yet"));
    const resource = resourceResponse(order);
    return res.status(200).send(resource);
})

router.post('/', auth, async (req, res) => {
//    const {rows: available} = await Orders.findProcessedOrder(parseInt(req.body.car_id));
//    if(available[0]) return res.status(400).send(clientError = errorResponse(400, "This car is not available for purchase as it is been processed for a user"));
//    const {error} = validate(req.body);
//    if (error) return res.status(400).send(clientError = errorResponse(400, error.details[0].message));
//         //get the email and id of the logged in user
    const {id} = req.user;
    let { car_id, amount, status, buyer_name, buyer_phone_no} = req.body;
    status = status ? status : 'Pending';
   //get the car user is trying to make purchase order for
   const {rows: car} = await Cars.findById(parseInt(car_id));
   if(!car[0]) return res.status(404).send(clientError = errorResponse(400, "The car you are trying to purchase does not exist"));
    const {rows: created} = await Orders.save(id, car_id, amount, status, "lastName", "firstName");
    if (created[0]) {
        const {id, car_id, created_on, status, amount, buyer_name, buyer_phone_no} = created[0];
        const mailOptions = {
            to: car[0].seller_email,
            from: 'Auto-Mart',
            subject: 'Purchase Order Notification Email',
            text:
                  'Hello,\n\n'
                  + `Your Posted AD ${car[0].manufacturer} has been purchased by ${buyer_name}.\n\n`
                  + `Here are the buyers details: \n\n`
                  + `Name: ${buyer_name}. \n\n`
                  + `Phone Number: ${buyer_phone_no}. You can call the buyer on the phone number for payment options. \n\n
                  Thank you for choosing Auto-Mart.`,
          };
          const result = await transporter.sendMail(mailOptions);
          if(result) {
            res.status(200).send({
                status : 200,
                data : {
                    id,
                    message: "Purchase order successful",
                    notify: "An email has been sent to the seller about your order, you will be contacted for processing.",
                    car_id,
                    created_on,
                    status,
                    buyer_name,
                    buyer_phone_no,
                    price: car[0].price,
                    price_offered: amount,
                }
            })
          }
          else {
              await Orders.deleteOrderByID(id);
              return res.status(500).send(clientError = errorResponse(500, "Error while processing your Purchase order, Try again.."))
          }
    }
})

router.patch("/:order_id/price", auth, async (req, res) => {
//     // validate request
//    const {error} = validateOrderByPrice(req.body);
//    if (error) return res.status(400).send(clientError = errorResponse(400, error.details[0].message));   
  // get the id of the order you want to update
   const orderID = parseInt(req.params.order_id);
   //check the database if the order id is valid
   const {rows: order} = await Orders.findById(orderID);
   // bounce the user out if it is not a valid order
   if(!order[0]) return res.status(404).send(errorMessage = errorResponse(404, "This purchase order does not exist"));
   let oldPriceOffered = order[0].amount; // set old_price_offered to order amount
   //only the order that is pending can be updated
   if(order[0].status != 'Pending') return res.status(400).send('You can only update the price, if the order is still pending');
   //update the order here
//    const {rows: updated} = await Orders.updateOrderPrice(orderID, req.body.new_price);
const {rows: updated} = await Orders.updateOrderPrice(orderID, req.body.price);

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

router.patch("/:order_id/status", auth, async (req, res) => {
     // validate request
   const {error} = validateOrderByStatus(req.body);
   if (error) return res.status(400).send(clientError = errorResponse(400, error.details[0].message));
    // get the id of the order you want to update
   const orderID = parseInt(req.params.order_id);
   //check the database if the order id is valid
   const {rows: order} = await Orders.findById(orderID);
    if(!order[0]) return res.status(404).send(errorMessage = errorResponse(404, "This purchase order does not exist"));
    //update the order status here
   const {rows: updated} = await Orders.updateOrderStatus(orderID, req.body.status);
   if(updated[0]) {
    const {id, car_id, status, amount} = updated[0];
    res.status(200).send({
        status: 200,
        data: {
            id ,
            message : "Successfully updated",
            car_id,
            status,
            amount
        }
    })
   }
 })
 

const validateOrderByPrice = req => {
    const schema = {
        new_price : Joi.number().required()
    }
    return Joi.validate(req, schema);
}

const validateOrderByStatus = req => {
    const schema = {
        status : Joi.string().required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;