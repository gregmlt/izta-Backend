const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    set: (v) => v.toLowerCase(),
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    // required: true,
  },
  website: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  glassdoor: {
    type: String,
    trim: true,
  },
  welcometothejungle: {
    type: String,
    trim: true,
  },
  siren: {
    type: Number,
    required: true,
    trim: true,
    // validate: {
    //   validator: function (v) {
    //     return /^\d{9}$/.test(v.toString());
    //   },
    //   message: (props) => `${props.value} is not a valid SIREN number!`,
    // },
  },
  siret: {
    type: Number,
    required: true,
    trim: true,
    // validate: {
    //   validator: function (v) {
    //     return /^\d{14}$/.test(v.toString());
    //   },
    //   message: (props) => `${props.value} is not a valid SIRET number!`,
    // },
  },
  creationDate: {
    type: Date,
    // required: true,
    trim: true,
  },
  adress: {
    type: String,
    // required: true,
    trim: true,
  },
  city: {
    type: String,
    // required: true,
    trim: true,
  },
  postalCode: {
    type: Number,
    // required: true,
    trim: true,
  },
  employeeNumber: {
    type: String,
    // required: true,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  labels: {
    type: String,
    trim: true,
  },
  pariteEntreprise: {
    type: Number,
    trim: true,
  },
  pariteDirection: {
    type: Number,
    trim: true,
  },
  ageMoyen: {
    type: Number,
    trim: true,
  },
  ecartSalaire: {
    type: Number,
    trim: true,
  },
  turnover: {
    type: Number,
    trim: true,
  },
  mecenat: {
    type: String,
    trim: true,
  },
  territorialScore: {
    type: String,
    set: (v) => v.toLowerCase(),
    enum: ["", "a", "b", "c", "d", "e"],
  },
  socialScore: {
    type: String,
    set: (v) => v.toLowerCase(),
    enum: ["", "a", "b", "c", "d", "e"],
  },
  fiscalScore: {
    type: String,
    set: (v) => v.toLowerCase(),
    enum: ["", "a", "b", "c", "d", "e"],
  },
});

const company = mongoose.model("companies", companySchema);

module.exports = company;
