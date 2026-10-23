const express=require("express");
const routes=express.Router();
const user=require("../controllers/user.controller");


// register user
routes.post("/register",user.registerUser);

// Log in 
routes.post("/login",user.loginUser);

// getAll User
routes.get("/all",user.getUser);

module.exports=routes;