const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
const config = require('config');




//login endpoint
router.post('/', async (req, res) => {
    const {error} = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
        
    const userEmail = await User.find(e => e.email === req.body.email);
    if (!userEmail) return res.status(400).send('Login Failed, invalid email or password.');

    const userPassword = await bcrypt.compare(req.body.password, userEmail.password);
    if (!userPassword) return res.status(400).send("Login Failed, invalid email or password");
    
    const token = jwt.sign({
        id : userEmail.id, 
        first_name: userEmail.first_name, 
        last_name: userEmail.last_name,
        email: userEmail.email
     }, config.get('jwtPrivateKey'));

     res.status(200).send({
        status : 200,
        data : {
            token : token,
            id : userEmail.id,
            first_name: userEmail.first_name,
            last_name : userEmail.last_name,
            email: userEmail.email
        }
      });

})


const validateUser = req => {
    const schema = {
        email : Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255)
    }
    return Joi.validate(req, schema);
}

module.exports = router;

 