var express = require('express');
const User = require('../models/users');
var router = express.Router();

require('../models/connection');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');


/* POST signup users. */



router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['firstname', 'lastname', 'email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  const hash = bcrypt.hashSync(req.body.password, 10);

  User.findOne({ email: req.body.email }).then(data => {
    
    if (data === null) {
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        token: uid2(32),
    

      });

      newUser.save().then(() => {
        res.json({ result: true });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

/* POST signin users. */

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ email: req.body.email, password: req.body.password }).then(data => {
    if (data) {
      res.json({ result: true });
    } else {
      res.json({ result: false, error: 'Identifiant ou mot de passe erroné' });
    }
  });
});


/* PUT users data. */

router.put('/user', (req, res) => {
  User.updateOne({ token: req.body.token }, {...req.body}).then(data => { 
        res.json({ result: true });
  
  })
});

module.exports = router;
