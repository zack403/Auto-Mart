const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');
const moment = require('moment');
const jwt = require('jsonwebtoken');



//signup endpoint
router.post('/', async (req, res) => {
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
       created_at : moment().format('MMM Do YYYY, h:mm:ss a'),
   
    };

    try {
      const result = await User.push(userToCreate);
      if ( result ) {
        const token = jwt.sign(
          {
            id: userToCreate.id,
            first_name: req.body.first_name,
            last_name: req.body.last_name
          },
          "jwtPrivateKey"
        );
          res.status(200).send({
            status : 200,
            data : {
                token : token,
                id : userToCreate.id,
                first_name: userToCreate.first_name,
                last_name : userToCreate.last_name,
                email: userToCreate.email,
                created_at : userToCreate.created_at
               
            }
          });
      }
    } catch (err) {
      res.send({
        status : 500,
        error: err.message          
      });
    }
    
});



//get all users
router.get('/getUsers', async (req, res) => {
  const users = User.map(({id, first_name, last_name, email, is_admin, created_at}) => 
  ({id, first_name, last_name, email, is_admin, created_at}) );
  res.send(users);
})

//get a single user
router.get('/:id',  async ({ params: { id } }, res) => {
  const user = await User.find(val => val.id === id);
  res.send(user);
});


 
module.exports = router;
