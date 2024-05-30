var express = require('express');
var router = express.Router();
const User = require("../models/users");


const nodemailer = require('nodemailer');

const email = process.env.NODEMAILER_EMAIL;
const password = process.env.NODEMAILER_PASSWORD;
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* POST forgot password, send email to retrieve pwd */


router.post("/forgot-password", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.fr', 
    port: 465, 
    secure: true, 
    auth: {
      user: email,
      pass: password,
    }
  });

  // send mail with defined transport object
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL, // sender address
    to: req.body.email, // list of receivers, ensure this is received from the request body
    subject: "Modifiez votre mot de passe", // Subject line
    text: "Vous avez oublié votre mot de passe. Cliquez sur le lien suivant pour créer un nouveau mot de passe: http://localhost:3001/resetpassword"
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});


// PUT changement de mot de passe.//
router.put('/password-change/:token', async (req, res) => {
  const token = req.params.token;
  const newPassword = req.body.newPassword;

  if (!newPassword) {
    return res.status(400).json({ result: false, message: 'Password is required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const result = await User.updateOne(
      { password: hashedPassword }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ result: false, message: 'User not found or password is the same as the old one' });
    }

    res.json({ result: true, message: 'Mot de passe mis à jour' });
  } catch (err) {
    res.status(500).json({ result: false, message: 'Erreur, modification non prise en compte', error: err.message });
  }
});


module.exports = router;

