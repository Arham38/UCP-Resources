// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    password: {
      type: String,
      required: true, // store hashed password here
      minlength: 8,
      select: false, // prevents returning password by default
    },
    role: {
      type: String,
      required: true,
      enum: ["student", "supervisor"],
      default: "student",
    },
    department: {
      type: String,
      trim: true,
      maxlength: 100,
      default: undefined, // keeps it optional (won't force empty string)
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});




module.exports = mongoose.model("User", userSchema);
