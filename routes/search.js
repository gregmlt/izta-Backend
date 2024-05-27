var express = require("express");
var router = express.Router();
const Company = require("../models/companies");
const User = require("../models/users");


// router.post('/search-filters', async (req, res) => {
//   const {
//     postalCode,
//     industry,
//     ratingIzta,
//     nationality,
//     employeeNumber,
//     labels,
//     societeAMission,
//     ess,
//     mecenat,
//     territorialScore,
//     socialScore,
//     fiscalScore,



//     description,
//     website,
//     linkedin,
//     glassdoor,
//     welcometothejungle,
//     siren,
//     siret,
//     creationDate,
//     adress,
//     city,
//     pariteEntreprise,
//     pariteDirection,
//     ageMoyen,
//     ecartSalaire,
//     turnover,
//     companyLogo,
//     kudos,
//     like
//   } = req.body;

//   // Créer une nouvelle instance de Company avec les données du formulaire
//   const newCompany = new Company({
//     companyName,
//     description,
//     website,
//     linkedin,
//     glassdoor,
//     welcometothejungle,
//     siren,
//     siret,
//     creationDate,
//     adress,
//     city,
//     postalCode,
//     employeeNumber,
//     industry,
//     labels,
//     pariteEntreprise,
//     pariteDirection,
//     ageMoyen,
//     ecartSalaire,
//     turnover,
//     mecenat,
//     territorialScore,
//     socialScore,
//     fiscalScore,
//     companyLogo,
//     kudos,
//     like
//   });

//   try {
//     // Sauvegarder la nouvelle compagnie dans la base de données
//     const savedCompany = await newCompany.save();
//     res.json({ result: true, data: savedCompany });
//   } catch (error) {
//     console.error('Error saving company:', error);
//     res.status(500).json({ result: false, error: 'Internal server error' });
//   }
// });



module.exports = router;
