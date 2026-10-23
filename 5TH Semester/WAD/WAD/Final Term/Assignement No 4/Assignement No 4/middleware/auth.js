const jwt = require("jsonwebtoken");
const user = require("../models/user.model");
const secretkey="arham";
function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    secretkey,
    { expiresIn: "7d" }
  );
}

module.exports = { signToken };
