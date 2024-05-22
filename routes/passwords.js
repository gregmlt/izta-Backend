var express = require('express');
var router = express.Router();

const nodemailer = require('nodemailer');

const email = process.env.NODEMAILER_EMAIL;
const password = process.env.NODEMAILER_PASSWORD;

router.post("/forgot-password", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.fr', // Remplacez par votre hôte SMTP
    port: 465, 
    secure: true, // Utilisez true pour le port 465
    auth: {
      user: email,
      pass: password,
    }
  });

  // send mail with defined transport object
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL, // sender address
    to: 'vecchmel@gmail.com', // list of receivers, ensure this is received from the request body
    subject: "Password Reset", // Subject line
    text: "You requested a password reset", // plain text body
    html: "<b>You requested a password reset</b>", // html body
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

module.exports = router;

