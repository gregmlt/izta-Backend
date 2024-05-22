const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
  },

  adress: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  postalCode: {
    type: String,
    trim: true,
  },
  diplome: {
    type: String,
    trim: true,
  },
  situation: {
    type: String,
    enum: [
      "je me renseigne",
      "je suis à l'écoute",
      "je suis en recherche active",
    ],
    trim: true,
  },
  likedCompanies: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "companies",
  },
  token: {
    type: String,
    trim: true,
  },
  verification: {
    type: Boolean,
    default: false,
  },
  company: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "companies",
  },

  kudos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
  },
  logo: {
    type: String,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
