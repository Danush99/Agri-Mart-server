const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const officerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "firstname is Required"],
  },
  lastname: {
    type: String,
    required: [true, "lastname is Required"],
  },
  birthday: {
    type: Date,
    required: [true, "birthday is Required"],
  },
  nic_number: {
    type: String,
    required: [true, "nic_number is Required"],
  },
  district: {
    type: String,
    required: [true, "District is Required"],
  },
  division: {
    type: String,
    required: [true, "division is Required"],
  },
  prime_officer: {
    type: String,
    required: [true, "prime_officer is Required"],
  },
  postal_Code: {
    type: Number,
    required: [true, "Postal_Code is Required"],
  },
  phone_number: {
    type: Number,
    required: [true, "phone_number is Required"],
  },
  proPicUrl: {
    type: String,
    required: [false, "proPicUrl is not Required"],
  },
});


module.exports = mongoose.model("officers", officerSchema);