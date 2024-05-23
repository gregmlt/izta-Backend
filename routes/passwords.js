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
    text: "Vous avez oublié votre mot de passe. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe", // plain text body
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


//Faire route post pour update le pwd
router.put('/password-change/:token', (req, res) => {
  const token = req.params.token;
  const newpassword = req.body.password;

  if (!newpassword) {
    return res.json({ result: false, message: 'Mot de passe requis' });
  }

  const hash = bcrypt.hashSync(req.body.password, 10);

  User.findOne({ token: token }).then((user) => {

//     if (data && bcrypt.compareSync(req.body.password, data.password)) {
//       res.json({ result: true, token: data.token });
//     } else {
//       res.json({ result: false, error: "Identifiant ou mot de passe erroné" });
//     }
//   });
// });

    if (user) {
      user.password = newpassword;
      user.save().then(() => {
        res.json({ result: true, message: 'Mot de passe mis à jour' });
      });
    } else {
      res.json({ result: false, message: 'Aucun utilisateur trouvé' });
    }

    
  });
});

module.exports = router;

