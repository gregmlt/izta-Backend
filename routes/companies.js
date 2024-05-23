const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const Company = require("../models/companies");
const User = require("../models/users");
const uniqid = require("uniqid");

const cloudinary = require('cloudinary').v2;
const fs = require('fs');


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




// Route pour que les utilisateurs puissent uploader le logo de l'entreprise
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST pour uploader une photo à checker demain 

// router.post('/uploadlogo/:_id', async (req, res) => {
//   if (!req.files || !req.files.photoFromFront) {
//     return res.json({ result: false, error: 'Aucun logo téléchargé' });
//   }

//   const photoPath = `./tmp/${uniqid()}.jpg`;
//   const resultMove = await req.files.photoFromFront.mv(photoPath);

//   if (resultMove) {
//     return res.json({ result: false, error: resultMove });
//   }

//   try {
//     const result = await cloudinary.uploader.upload(photoPath, { folder: 'user_logos' });
//     return res.json({ result: true, url: result.secure_url });
//   } catch (error) {
//     return res.json({ result: false, error });
//   }
// });


// PUT pour updater un logo
router.put('/updatelogo/:_id', async (req, res) => {
  const { _id } = req.params;
  const url  = req.body.companyLogo; // Assurez-vous que le corps de la requête contient l'URL de l'image uploadée
  console.log(url);
  if (!url) {
    return res.json({ result: false, error: 'Aucune URL' });
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
