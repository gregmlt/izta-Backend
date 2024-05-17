const mongoose = require("mongoose");

const userCompanieSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  verification: {
    type: Boolean,
    default: false,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    required: true,
  },
  kudos: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
  },
  logo: {
    type: String,
  },
});

const userCompanie = mongoose.model("userCompanies", userCompanieSchema);

module.exports = userCompanie;
