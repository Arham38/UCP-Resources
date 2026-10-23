const express=require("express");
const mongoose=require("mongoose");
const db=require("./Database/db");

const User=require("./models/User.model");

const Userroutes=require("./routes/User.routes");
const productroutes=require("./routes/products.routes");
const passport=require("./config/auth");


const port=3000;
const app=express();

app.use(express.json());

// app.use("/api",departmentroutes);

app.use(passport.initialize());
//User
app.use("/api",Userroutes);

//product
app.use("/api/products",productroutes);

// Server
app.listen(port,()=>{
    console.log(`Server is connected on port ${port}`)
})