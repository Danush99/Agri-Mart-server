const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is Required"],
    lowercase:true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is Required"],
  },
  userType: {
    type: String,
    required: [true, "userType is Required"],
  },
  typeId: {
    type: String,
    required: [true, "typeId is Required"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.Is_existuser = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    return false;
  }else{
    return true
  }
}

userSchema.statics.login = async function (email, password,res) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    return res.status(402).json({ "message": `The password that you've entered is incorrect.` });
  }
  return res.status(401).json({ "message": `The email address you entered isn't connected to an account.` });
};

module.exports = mongoose.model("users", userSchema);