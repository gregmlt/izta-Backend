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
  birthdate: {
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
    type: Map,
    of: Boolean,
  },
  situation: {
    type: Map,
    of: Boolean,
  },
  likedCompanies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
    },
  ],
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

  kudos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
    },
  ],
  logo: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
