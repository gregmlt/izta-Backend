var express = require("express");
var router = express.Router();
const Company = require("../models/companies");

router.get("/get/allcompanies", async (req, res) => {
  const { region, employeeNumber, companyName, siret, siren } = req.query;

  let query = {};

  for (const key in req.query) {
    if (req.query[key]) {
      query[key] = req.query[key];
    }
  }

  try {
    const companies = await Company.find(query);

    res.json({ result: true, message: companies });
  } catch (error) {
    console.error("Error find companies:", error);
    throw error;
  }
});

module.exports = router;
