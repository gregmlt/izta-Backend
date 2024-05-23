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

// Route pour uploader une photo et mettre à jour le logo de l'utilisateur
router.post("/upload/:_id", async (req, res) => {
  if (!req.files || !req.files.photoFromFront) {
    return res.status(400).json({ result: false, error: "No file uploaded" });
  }

  const photoPath = `./tmp/${uniqid()}.jpg`;
  const resultMove = await req.files.photoFromFront.mv(photoPath);

  if (resultMove) {
    return res.status(500).json({ result: false, error: resultMove });
  }

  try {
    const result = await cloudinary.uploader.upload(photoPath, {
      folder: "user_logos",
    });
    return res.status(200).json({ result: true, url: result.secure_url });
  } catch (error) {
    return res.status(500).json({ result: false, error });
  }
});

router.put("/updatelogo/:_id", async (req, res) => {
  const { token } = req.params;
  const { url } = req.body; // Assurez-vous que le corps de la requête contient l'URL de l'image uploadée

  if (!url) {
    return res.json({ result: false, error: "No URL provided" });
  }

  try {
    await User.updateOne({ token }, { logo: url });
    const updatedUser = await User.findOne({ token });
    return res.status.json({ result: true, data: updatedUser });
  } catch (error) {
    return res.json({ result: false, error });
  }
});

// router.post('/upload', async (req, res) => {
//  const photoPath = `./tmp/${uniqid()}.jpg`;
//  const resultMove = await req.files.photoFromFront.mv(photoPath);

//  if (!resultMove) {
//    ...
//    res.json({ result: true });
//  } else {
//    res.json({ result: false, error: resultMove });
//  }
// });

// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Exemple d'utilisation de Cloudinary pour uploader une image
// cloudinary.uploader.upload("path_to_your_image", function(error, result) {
//   console.log(result);
// });

// router.put("/updatelogo/:token", (req, res) => {

//   User.updateOne({ token: req.params.token }, { ...req.body }).then(() => {
//     User.findOne({ token: req.params.token }).then((data) =>
//       res.json({ result: true, data: data })
//     );
//   });
// });

module.exports = router;
