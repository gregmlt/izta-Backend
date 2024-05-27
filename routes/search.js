var express = require("express");
var router = express.Router();
const Company = require("../models/companies");

const regionsData = [
  {
    name: "Auvergne-Rhône-Alpes",
    departments: [1, 3, 7, 15, 26, 38, 42, 43, 63, 69, 73, 74],
  },
  {
    name: "Bourgogne-Franche-Comté",
    departments: [21, 25, 39, 58, 70, 71, 89, 90],
  },
  {
    name: "Bretagne",
    departments: [22, 29, 35, 56],
  },
  {
    name: "Centre-Val de Loire",
    departments: [18, 28, 36, 37, 41, 45],
  },
  {
    name: "Corse",
    departments: ["2A", "2B"],
  },
  {
    name: "Grand Est",
    departments: [8, 10, 51, 52, 54, 55, 57, 67, 68, 88],
  },
  {
    name: "Hauts-de-France",
    departments: [2, 59, 60, 62, 80],
  },
  {
    name: "Île-de-France",
    departments: [75, 77, 78, 91, 92, 93, 94, 95],
  },
  {
    name: "Normandie",
    departments: [14, 27, 50, 61, 76],
  },
  {
    name: "Nouvelle-Aquitaine",
    departments: [16, 17, 19, 23, 24, 33, 40, 47, 64, 79, 86, 87],
  },
  {
    name: "Occitanie",
    departments: [9, 11, 12, 30, 31, 32, 34, 46, 48, 65, 66, 81, 82],
  },
  {
    name: "Pays de la Loire",
    departments: [44, 49, 53, 72, 85],
  },
  {
    name: "Provence-Alpes-Côte d'Azur",
    departments: [4, 5, 6, 13, 83, 84],
  },
  {
    name: "Régions d'outre-mer",
    departments: [971, 972, 973, 974, 976],
  },
];

router.get("/get/allcompanies/:regions?", async (req, res) => {
  const regions = req.params.regions || null;
  const region = regionsData.find((region) => region.name === regions);

  console.log(region);

  if (region) {
    const response = await Company.find({
      postalCode: { $in: region.departments },
    });
    res.json({ response });
  } else {
    res.json({ result: false });
  }
});

module.exports = router;
