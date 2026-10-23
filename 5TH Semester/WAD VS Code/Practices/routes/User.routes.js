const express = require("express");
const passport = require("passport");
const User=require("../models/User.model");
const {addUser,fetchUser} = require("../controller/User.controller");
const authentication=require("../config/jwtauthentication");
const jwt=require("jsonwebtoken");
const Userroutes = express.Router();

const key="12345";

const localAuth = passport.authenticate("local", { session: false });

// LOGIN
Userroutes.post("/login",async(req, res) => {
  const {username,password}=req.body;
  const user=await User.findOne({username:username})
  if(!user){
    return res.status(400).json({success:false,message:"Wrong User Name"})
  }
  if(password!=user.password){
    return res.status({success:false,message:"Wrong User Name And Password"})
  }

  const token=jwt.sign({username:user.username},key,{expiresIn:"1h"});
    res.status(200).json({
      success: true,
      id:req._id,
      username:username,
      token,
      message:"Log In successfull"
    });
  }
);

// REGISTER
Userroutes.post("/register/User", addUser);

//  PROTECTED GET API
Userroutes.get(
  "/get-User",
  authentication,
  fetchUser
);

module.exports = Userroutes;
