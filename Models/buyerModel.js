const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const buyerSchema = new mongoose.Schema({
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
    required: [false, "birthday is Required"],
  },
  nic_number: {
    type: String,
    required: [false, "nic_number is Required"],
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


module.exports = mongoose.model("buyers", buyerSchema);