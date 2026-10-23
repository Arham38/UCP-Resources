const mongoose=require("mongoose");

const personSchema=new mongoose.Schema({
    name:{type:String,required:true},
    age:Number,
    city:String,
    contact:Number
});

const Arham=mongoose.model("Arham",personSchema,"Person");
module.exports=Arham;