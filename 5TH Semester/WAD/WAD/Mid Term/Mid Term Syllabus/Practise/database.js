const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/University")
.then(()=>{console.log("Mongo Connect To Server")})
.catch((err)=>{Console.log("Mongo Cant Connect",err)});
