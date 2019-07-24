const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User} = require('../models/user');
const generateAuthToken = require('../helper/generateAuthToken');
const errorResponse = require('../helper/errorResponse');


let errMessage;
//login endpoint
router.post('/', async (req, res) => {
    const {error} = validateUser(req.body);
    if (error){
        const clientError = errorResponse(400, error.details[0].message);
        return res.status(400).send(clientError);
    }  
    let clientEmail = req.body.email;
    clientEmail = clientEmail.toLowerCase();
    const {rows: userEmail} = await User.findByEmail(clientEmail);
    if (!userEmail[0]) return res.status(400).send(errMessage = errorResponse(400, 'Login Failed, invalid email or password.')); 
    const userPassword = await bcrypt.compare(req.body.password, userEmail[0].password);
    if (!userPassword) return res.status(400).send(errMessage = errorResponse(400, 'Login Failed, invalid email or password.')); 
    const {id, email, first_name, last_name, is_admin} = userEmail[0]; //get user details
    const token = generateAuthToken(id, email, first_name, is_admin); // assing a token to the ser here
     res.status(200).send({
        status : 200,
        data : {
            token,
            id,
            first_name,
            is_admin,
            last_name,
            email
        }
      });
})

const validateUser = req => {
    const schema = {
        email : Joi.string().required().email(),
        password: Joi.string().required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;

 