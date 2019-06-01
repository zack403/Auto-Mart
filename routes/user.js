const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');
const moment = require('../helper/moment');
const jwt = require('jsonwebtoken');
const config = require('config');



//signup endpoint
router.post('/', async (req, res, next) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.find(e => e.email === req.body.email);
  if (user) return res.status(400).send(`This email ${req.body.email} is already taken`);
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const userToCreate = {
       id : User.length + 1,
       first_name : req.body.first_name,
       last_name : req.body.last_name,
       email : req.body.email,
       password : hashedPassword,
       created_at : moment(),
       is_admin : req.body.is_admin ? req.body.is_admin : false
   
    };

      const result = await User.push(userToCreate);
      if ( result ) {
        const token = jwt.sign(
          {
            id: userToCreate.id,
            first_name: req.body.first_name,
            email : req.body.email,
            is_admin : userToCreate.is_admin
          },
          config.get('jwtPrivateKey')
        );
          res.status(200).send({
            status : 200,
            data : {
                token : token,
                message: "Account successfully created",
                id : userToCreate.id,
                first_name: userToCreate.first_name,
                last_name : userToCreate.last_name,
                email: userToCreate.email,
                created_at : userToCreate.created_at
               
            }
          });
      }
});



//get all users
router.get('/getUsers', async (req, res) => {
  res.status(200).send(User)
})

//get a single user
router.get('/:id',  async ({ params: { id } }, res) => {
  const user = await User.find(user => user.id === parseInt(id));
  if(!user) return res.status(404).send("User with the given Id could not be found");
  res.send(user);
});


 
module.exports = router;
