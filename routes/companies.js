const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const Company = require("../models/companies");
const User = require("../models/users");

// ? Add a user to company's kudos

router.post("/post/kudos/:siret/:token", async (req, res) => {
  const siret = req.params.siret;
  const token = req.params.token;
  try {
    const company = await Company.findOne({ siret });

    if (!company) {
      return res.json({ result: false, message: "Company doesn't exist" });
    }

    const user = await User.findOne({ token });
    const userID = user["_id"];

    const response = await Company.updateOne(
      { siret },
      { $push: { kudos: userID } }
    );

    return res.json({ result: true, message: "kudo added" });
  } catch (error) {
    console.error("Error adding kudos to company account :", error);
    return res
      .status(500)
      .json({ result: false, message: "Internal server error" });
  }
});

// ? Get the number of kudos for a company

router.get("/get/kudos/:siret", async (req, res) => {
  const siret = req.params.siret;
  const company = await Company.findOne({ siret });
  const nbrKudos = company.kudos.length;

  if (company) {
    return res.json({ result: true, message: nbrKudos });
  } else {
    return res.json({ result: false, message: "Company doesn't exist" });
  }
});

// ? Get the number of like for a company

router.get("/get/like/:siret", async (req, res) => {
  const siret = req.params.siret;
  const company = await Company.findOne({ siret });
  const nbrLike = company.like.length;

  if (company) {
    return res.json({ result: true, message: nbrLike });
  } else {
    return res.json({ result: false, message: "Company doesn't exist" });
  }
});

module.exports = router;
