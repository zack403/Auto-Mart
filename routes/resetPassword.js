const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const config = require('config');
const bcrypt = require('bcrypt');
const { User } = require('../models/user');


const transporter = nodemailer.createTransport(sgTransport({
  auth: {
    api_key: config.get('sendgrid_key'),
  },
}));

router.post('/:user_email/reset_password', async (req, res) => {

  const userEmail = req.params.user_email;
  const { rows: user } = await User.findByEmail(userEmail);
  if (!user[0]) return res.status(404).send('You do not have an account with us');

  // the user is a valid user set the user new password here..
  const { oldPassword, newPassword } = req.body;
  if (oldPassword != null && newPassword != null) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const { rows: resetPassword } = await User.updateUser(user[0].id, hashedPassword);
    if (resetPassword[0]) return res.status(200).send('Password successfully changed');
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

module.exports = router;