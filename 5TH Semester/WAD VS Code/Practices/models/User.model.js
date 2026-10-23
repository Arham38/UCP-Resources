const mongoose=require("mongoose");

const userScehma=new mongoose.Schema({
    name:{
        type:String,
    },
    username:{
        type:String,
        required:true,
         unique: true
    },
    password:{
        type:String
    },
    age: {
        type:Number
    }
    
})

const User=mongoose.model("User",userScehma,"UserSchema");

module.exports=User;