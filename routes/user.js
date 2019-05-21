const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');


router.get('/me', async (req, res) => {
    res.send(User);
})

router.post('/', async (req, res) => {
    console.log(req.body);
    if(req.body === "{}") return res.status(400).send("Make sure you fill the required fields")
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const isEmailExist = await User.find(e => e.email === req.body.email);
    if (isEmailExist) {
        res.status(400).send(`This email ${req.body.email} is already taken`);
        return;
      }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const userToCreate = {
         id : User.length + 1,
         first_name : req.body.first_name,
         last_name : req.body.last_name,
         email : req.body.email,
         password : hashedPassword,
         created_at : Date.now(),
         is_admin : false
      };

      try {
        const result = await User.push(userToCreate);
        if(result){
            res.send(userToCreate);
        }
      }catch (error) {
        res.send(error.message);
      }
      

});

module.exports = router;
