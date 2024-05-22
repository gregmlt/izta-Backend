var express = require("express");
const User = require("../models/users");
var router = express.Router();
const Company = require("../models/companies");

require("../models/connection");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

/* POST signup users. */

router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["firstname", "lastname", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const hash = bcrypt.hashSync(req.body.password, 10);

  User.findOne({ email: req.body.email }).then((data) => {
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
      res.json({ result: false, error: "User already exists" });
    }
  });
});

/* POST signin users. */

router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token });
    } else {
      res.json({ result: false, error: "Identifiant ou mot de passe erroné" });
    }
  });
});

/* PUT users data. */

router.put("/infos/:token", (req, res) => {
  const {
    firstname,
    lastname,
    email,
    birthDate,
    adress,
    city,
    postalCode,
    diplome,
    situation,
    likedCompanies,
    kudos,
  } = req.body;

  User.updateOne({ token: req.params.token }, { ...req.body }).then(() => {
    User.findOne({ token: req.params.token }).then((data) =>
      res.json({ result: true, data: data })
    );
  });
});

/* PUT users change Password. */

router.put("/password/:token", (req, res) => {});

// ? Like a company and add it in DB
router.post("/like/:token/:idCompany", async (req, res) => {
  const companyId = req.params.idCompany;
  const token = req.params.token;

  try {
    const user = await User.findOne({ token });

    // ** Check if user exists ** \\
    if (!user) {
      return res.json({ result: false, message: "User doesn't exist" });
    }

    const company = await Company.findById(companyId);

    // ** Check if the company exists ** \\
    if (!company) {
      return res.json({ result: false, message: "Company not existing" });
    }

    if (user.likedCompanies.includes(companyId)) {
      // ** Dislike a company ** \\
      await User.updateOne({ token }, { $pull: { likedCompanies: companyId } });
      return res.json({ result: true, message: "Company disliked" });
    } else {
      // ** Like a company ** \\
      await User.updateOne({ token }, { $push: { likedCompanies: companyId } });
      return res.json({ result: true, message: "Company liked" });
    }
  } catch (error) {
    console.error("Error liking/disliking company:", error);
    return res
      .status(500)
      .json({ result: false, message: "Internal server error" });
  }
});

module.exports = router;
