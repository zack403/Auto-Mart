const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User} = require('../models/user');
const generateAuthToken = require('../helper/generateAuthToken');


//login endpoint
router.post('/', async (req, res) => {
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const {rows: userEmail} = await User.findByEmail(req.body.email);
    if (!userEmail[0]) return res.status(400).send('Login Failed, invalid email or password.'); 
    const userPassword = await bcrypt.compare(req.body.password, userEmail[0].password);
    if (!userPassword) return res.status(400).send('Login Failed, invalid email or password.'); 
    const {id, email, first_name, last_name, is_admin} = userEmail[0]; //get user details
    const token = generateAuthToken(id, email, first_name, is_admin); // assing a token to the ser here
     res.status(200).send({
        status : 200,
        data : {
            token,
            id,
            first_name,
            last_name,
            email
        }
      });
})

const validateUser = req => {
    const schema = {
        email : Joi.string().required().email(),
        password: Joi.string().required().min(7).max(255)
    }
    return Joi.validate(req, schema);
}

module.exports = router;

 