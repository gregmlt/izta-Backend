const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const Company = require("../models/companies");

// ! Data

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

// ! Function
// ? Variables
let token;

// ? Function to find region

function findRegionByPostalCode(postalCode) {
  // Extraire les deux premiers chiffres du code postal
  const departmentCode = parseInt(postalCode.substring(0, 2), 10);

  // Trouver la région correspondante
  for (const region of regionsData) {
    if (region.departments.includes(departmentCode)) {
      return region.name;
    }
  }

  // Si aucune région n'est trouvée
  return null;
}

// ? Function generate token for INSEE API
const generateToken = async () => {
  try {
    // *** Search the token to my account
    const response = await fetch("https://api.insee.fr/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic cUVaMWJjT2dRa0h3MzRuXzZfRmk4ODQ1VktFYTp2enhaZjlrYkFHdktSS0hmQkw1QjBSM2ZNRk1h",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    // *** Log the token into a variable */
    const data = await response.json();
    token = data.access_token;
    return data.access_token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};

// ? Call the INSEE API to have companies from 42 to 53 of ("trancheEffectifsUniteLegale")
const catchCompanies = async () => {
  try {
    const response = await fetch(
      "https://api.insee.fr/entreprises/sirene/V3.11/siret?q=trancheEffectifsEtablissement%3A%5B42%20TO%2053%5D%20AND%20-categorieJuridiqueUniteLegale%3A4*%20OR%20-categorieJuridiqueUniteLegale%3A7*&nombre=1000",

      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    const tranchEmp = {
      41: "500 à 999 salariés",
      42: "1 000 à 1 999 salariés",
      51: "2 000 à 4 999 salariés",
      52: "5 000 à 9 999 salariés",
      53: "10 000 salariés et plus",
    };

    for (const e of data.etablissements) {
      const existingCompany = await Company.findOne({ siret: e.siret });

      if (!existingCompany) {
        const siren = e.siren;
        let companyScoring = {
          territorialScore: "",
          socialScore: "",
          fiscalScore: "",
        };

        try {
          companyScoring = await getScoring(siren);
        } catch (scoringError) {
          console.error(
            `Error fetching scoring for SIREN ${siren}:`,
            scoringError
          );
        }

        const companySirenAPI = {
          companyName: e.uniteLegale?.denominationUniteLegale || "",
          siren: String(e.siren),
          siret: String(e.siret),
          creationDate: e.dateCreationEtablissement || "",
          adress: `${e.adresseEtablissement?.numeroVoieEtablissement || ""} ${
            e.adresseEtablissement?.typeVoieEtablissement || ""
          } ${e.adresseEtablissement?.libelleVoieEtablissement || ""}`,
          city: e.adresseEtablissement?.libelleCommuneEtablissement || "",
          postalCode: e.adresseEtablissement?.codePostalEtablissement || "",
          region: e.adresseEtablissement?.codePostalEtablissement
            ? findRegionByPostalCode(
                e.adresseEtablissement?.codePostalEtablissement
              )
            : "",
          employeeNumber:
            tranchEmp[e.trancheEffectifsEtablissement] || "Unknown",
        };

        const newCompany = new Company({
          ...companySirenAPI,
          ...companyScoring,
        });
        newCompany.save();
      }
    }

    return data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

const getScoring = async (siren) => {
  try {
    const response = await fetch(
      `https://api.societe.com/api/v1/entreprise/${siren}/scoring`,
      {
        headers: {
          "X-Authorization": "socapi 53858bbb73258f0e4b1c64217e786423",
        },
      }
    );

    const data = await response.json();

    if (
      response.ok &&
      data.data &&
      data.data["extra-financier"] &&
      data.data["extra-financier"].score
    ) {
      return {
        territorialScore:
          data.data["extra-financier"].score["territorial"] || "",
        socialScore: data.data["extra-financier"].score["social"] || "",
        fiscalScore: data.data["extra-financier"].score["fiscal"] || "",
      };
    } else {
      throw new Error("Scoring data is incomplete or missing");
    }
  } catch (error) {
    console.error(`Error fetching scoring for SIREN ${siren}:`, error);
    return {
      territorialScore: "",
      socialScore: "",
      fiscalScore: "",
    };
  }
};

// ? Function to get all the data
const getData = async () => {
  try {
    await generateToken();
    await catchCompanies();
  } catch (error) {
    console.error("Error getting data:", error);
  }
};

// ! Route
router.get("/getdata", async (req, res) => {
  try {
    await getData();
    res.json({ result: true, message: "BDD saved" });
  } catch (error) {
    console.error("Error in /getdata route:", error);
    res.status(500).json({ result: false, message: "Error fetching data" });
  }
});

module.exports = router;
