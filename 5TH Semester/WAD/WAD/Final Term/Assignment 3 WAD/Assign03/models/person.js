const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const personSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});

personSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

personSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Person", personSchema);
