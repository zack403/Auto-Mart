const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const config = require('config');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const errorResponse =  require('../helper/errorResponse');
const { User } = require('../models/user');
const resourceResponse = require('../helper/getAllResourceResponse');



const transporter = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: config.get('sendgrid_key'),
  },
}));

let clientError;
let message;


router.post('/:user_email/reset_password', async (req, res) => {
  const email = req.params.user_email;
  const {error: emailError} = validateEmail(email);
  if(emailError) return res.status(400).send(clientError = errorResponse(400, error.details[0].message));
  
  const {error: passwordError} = validatePassword(req.body);
  if(passwordError) return res.status(400).send(clientError = errorResponse(400, error.details[0].message));
  
  const { rows: user } = await User.findByEmail(userEmail);
  if (!user[0]) return res.status(404).send(clientError = errorResponse(400, 'The email you provided does not exist with us'));

  // the user is a valid user set the user new password here..
  const { password, confirm_password } = req.body;
  if (password != null && confirm_password != null) {
    const {error} = validatePassword(req.body);
    if(error) return res.status(400).send(clientError = errorResponse(400, error.details[0].message));
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(confirm_password, salt);
    const { rows: resetPassword } = await User.updateUser(user[0].id, hashedPassword);
    if (resetPassword[0]) return res.status(200).send(message = resourceResponse(200, 'Password successfully changed'));
  }

  // the user is a valid user, send an email containing the users password
  const mailOptions = {
    to: userEmail,
    from: 'Auto-Mart',
    subject: 'Password Reset Email',
    text:
          'Hello,\n\n'
          + `Your new password is ${user[0].email}/000,\n\n`
          + 'kindly login here: https://zack403.github.io/Auto-Mart',
  };
  try {
    const result = await transporter.sendMail(mailOptions);
    if (result) {
      res.status(200).send({
        message: 'Email Successfully sent',
        email: `An email has been sent to ${userEmail} containing your new password.Check your spam folder if you cant find it in your inbox.`,
      });
    }
  } catch (error) {
    res.status(500).send('Error while sending email');
  }
});

const validatePassword = req => {
  const schema = {
    password: Joi.string().min(7).alphanum().max(255).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().strict().min(7)
       .alphanum().max(255),
  }
  return Joi.validate(req, schema);
}
const validateEmail = req => {
  const schema = {
    email: Joi.string().required().email()
  }
  return Joi.validate(req, schema);
}

module.exports = router;
