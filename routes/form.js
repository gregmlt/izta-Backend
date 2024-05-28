var express = require("express");
var router = express.Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const email = process.env.NODEMAILER_EMAIL;
const password = process.env.NODEMAILER_PASSWORD;

// POST to sent form contact to melanie@izta.fr
router.post('/form-data', async (req, res) => {
  const { name, Email, message, phone } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.ionos.fr',
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: password,
    }
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: 'melanie@izta.fr',
    subject: "Nouveau message du formulaire de contact",
    text: `Nom: ${name}\nEmail: ${Email}\nTéléphone: ${phone}\n\nMessage:\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to send message' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ success: true, message: 'Message sent successfully' });
    }
  });
});

module.exports = router;
