const mongoose=require("mongoose")

const bookSchema=new mongoose.Schema(
    {
        id:{
            type:Number,
            required:true,
            unique:true
        },
        title:{
            type:String,
           
        },
        author:{
            type:String,
           
        },
        isAvailable:{
            type:Boolean
        },
        salary:{
            type:Number
    }
    },
    
    {
        timestamps:true
    })
    const Book=mongoose.model('Book',bookSchema)
    module.exports=Book