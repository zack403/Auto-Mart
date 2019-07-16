const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');
const auth = require('../middleware/auth');
const errorResponse = require('../helper/errorResponse');
const generateAuthToken = require('../helper/generateAuthToken');
 
//signup endpoint
router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if (error){
    const clientError = errorResponse(400, error.details[0].message);
    return res.status(400).send(clientError);
  }
  const {first_name, last_name, email, address, password} = req.body; 
  const {rows: user} = await User.findByEmail(email);
  if (user[0]) {
    const userError = errorResponse(400, `An account with email ${email} already exist`);
    return res.status(400).send(userError);
  } 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const {rows: created} = await User.save(first_name, last_name, email, address, hashedPassword, hashedPassword);
      if ( created[0] ) {
        const {id, is_admin, first_name, last_name, email, created_at} = created[0];
        // const token = generateAuthToken(id, email, first_name, is_admin); 
          res.status(201).send({
            status : 201,
            data : {
                // token,
                message: "Account successfully created",
                id,
                first_name,
                last_name,
                email,
                created_at
            }
          });
      }
});

//get a single user
router.get('/:id', auth, async ({ params: { id: userId } }, res) => {
  let errorMessage;
  const {rows: user} = await User.findById(parseInt(userId));
  if(!user[0]) return res.status(404).send(errorMessage = errorResponse(404, "User with the given Id could not be found"));
  const {id, first_name, last_name, email, is_admin} = user[0];
  res.status(200).send({
    id,
    first_name,
    last_name,
    email,
    is_admin
  });
});
 
module.exports = router;
