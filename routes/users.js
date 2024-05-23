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

      newUser.save().then((data) => {
        res.json({ result: true, token: data.token });
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

/* GET users data. */

router.get("/infos/:token", (req, res) => {
  const token = req.params.token;

  User.findOne({ token: token }).then((data) => {
    if (data) {
      res.json({ result: true, data: data });
    } else {
      res.json({ result: false, message: "User not found" });
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
  } = req.body;

  User.updateOne({ token: req.params.token }, { ...req.body }).then(() => {
    User.findOne({ token: req.params.token }).then((data) =>
      res.json({ result: true, data: data })
    );
  });
});

// ? Like/dislike a company and add/remove it in DB
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
      await Company.updateOne(
        { _id: companyId },
        { $pull: { like: user["_id"] } }
      );
      return res.json({ result: true, message: "Company disliked" });
    } else {
      // ** Like a company ** \\
      await User.updateOne({ token }, { $push: { likedCompanies: companyId } });
      await Company.updateOne(
        { _id: companyId },
        { $push: { like: user["_id"] } }
      );
      return res.json({ result: true, message: "Company liked" });
    }
  } catch (error) {
    console.error("Error liking/disliking company:", error);
    return res
      .status(500)
      .json({ result: false, message: "Internal server error" });
  }
});

// ? Search a company with his SIRET number

router.get("/get/:siret", async (req, res) => {
  const siret = req.params.siret;
  try {
    const response = await Company.findOne({ siret });
    response
      ? res.json({ result: true, message: response })
      : res.json({ result: false, message: "company not found" });
    return;
  } catch (error) {
    console.error("Error liking/disliking company:", error);
    return res
      .status(500)
      .json({ result: false, message: "Internal server error" });
  }
});

// ? Add a company to an user account

router.post("/post/:siret/:token", async (req, res) => {
  const siret = req.params.siret;
  const token = req.params.token;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, message: "User doesn't exist" });
    }

    const company = await Company.findOne({ siret });
    const companyID = company["_id"];

    if (user.company.includes(companyID)) {
      return res.json({
        result: false,
        message: "User already owns this company",
      });
    }

    const addCompany = await User.updateOne(
      { token },
      { $push: { company: companyID } }
    );
    return res.json({ result: true, message: "company successfully added" });
  } catch (error) {
    console.error("Error adding company to user account :", error);
    return res
      .status(500)
      .json({ result: false, message: "Internal server error" });
  }
});

// ? Add a company to user's kudos

router.post("/post/kudos/:siret/:token", async (req, res) => {
  const siret = req.params.siret;
  const token = req.params.token;
  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.json({ result: false, message: "User doesn't exist" });
    }

    const company = await Company.findOne({ siret });
    const companyID = company["_id"];

    const response = await User.updateOne(
      { token },
      { $push: { kudos: companyID } }
    );

    return res.json({ result: true, message: "kudo added" });
  } catch (error) {
    console.error("Error adding kudos to user account :", error);
    return res
      .status(500)
      .json({ result: false, message: "Internal server error" });
  }
});

module.exports = router;
