const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
  },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePasswordInDb = async function (pswd, pswdInDb) {
  return await bcrypt.compare(pswd, pswdInDb);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
