const express=require("express");
const app=express();
const _=require("lodash");
const port=3000;
const database=require("./database");
const person=require("./person");
const bodyParse=require("body-parser");
const e = require("express");
app.use(bodyParse.json());

app.post("/person",async(req,resp)=>{
    try{
    const data=req.body;
    const newperson=new person(data);
    const response=await newperson.save();
    console.log("Data Saved Successfully",data);
    resp.status(200).json(response)
    }catch(err){
        console.log("Data Cant Save ",err);
        resp.status(500).json(err);
    }

})
// create server
app.listen(port,()=>{
    console.log("Server Are Open Now ",port);
});


