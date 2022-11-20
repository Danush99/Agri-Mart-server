const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "firstname is Required"],
  },
  lastname: {
    type: String,
    required: [true, "lastname is Required"],
  },
});


module.exports = mongoose.model("admins", adminSchema);