const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const Company = require("../models/companies");
const User = require("../models/users");
const uniqid = require("uniqid");

const cloudinary = require("cloudinary").v2;
const fs = require("fs");

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

// ? Get the number of kudos & like for a company

router.get("/get/statistics/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ token }).populate("company");

    if (!user || !user.company.length) {
      return res.json({
        result: false,
        message: "User or associated company not found",
      });
    }

    const company = user.company[0];

    const nbrKudos = company.kudos ? company.kudos.length : 0;
    const nbrLike = company.like ? company.like.length : 0;

    return res.json({ result: true, nbrKudos, nbrLike });
  } catch (error) {
    console.error("Error fetching company statistics:", error);
    return res
      .status(500)
      .json({ result: false, message: "Internal server error" });
  }
});

// ? Get the company for the connexion tunnel
router.get("/get/:siret", async (req, res) => {
  const siret = req.params.siret;
  try {
    const company = await Company.findOne({ siret });

    if (company) {
      return res.json({ result: true, company: company });
    } else {
      return res.json({ result: false, company: "company doesn't exist" });
    }
  } catch (error) {
    console.error("Error finding a company :", error);
    return res
      .status(500)
      .json({ result: false, message: "Internal server error" });
  }
});

// Route pour que les utilisateurs puissent uploader le logo de l'entreprise
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloudinary_url: process.env.CLOUDINARY_URL,
});

// PUT pour updater un logo
router.put("/updatelogo/:_id", async (req, res) => {
  const { _id } = req.params;
  const url = req.body.companyLogo; // Assurez-vous que le corps de la requête contient l'URL de l'image uploadée
  console.log(url);
  if (!url) {
    return res.json({ result: false, error: "Aucune URL" });
  }

  try {
    await Company.updateOne({ _id }, { companyLogo: url });
    const companyLogo = await Company.findOne({ _id });
    return res.json({ result: true, data: companyLogo });
  } catch (error) {
    return res.json({ result: false, error });
  }
});

module.exports = router;
