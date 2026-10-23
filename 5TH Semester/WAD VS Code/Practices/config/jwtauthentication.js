const jwt=require("jsonwebtoken");
const Student=require("../models/User.model");

const key="12345";
const authentication=async (req,res,next)=>{
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token){
         return res.status(403).json({ message: 'Access denied. No token provided.' });
    }
    
    jwt.verify(token,key,(err,user)=>{
        if(err){
                return res.status(403).json({ message: 'Invalid token' });        
        }
        req.user=user
        next();
    })
}

module.exports=authentication;