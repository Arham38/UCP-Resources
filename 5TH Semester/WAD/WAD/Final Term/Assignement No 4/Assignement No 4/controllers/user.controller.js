const usermodel = require('../models/user.model');
const {signToken}=require("../middleware/auth");
const bcrypt=require("bcrypt");


const registerUser=async(req, res) => {
    try {
        const { name, email, password,role,department } = req.body;
        const existingUser = await usermodel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const saveuser=await usermodel.create({
            name,email,password,role,department
        });
        res.status(201).json(saveuser,{ message: 'User registered successfully' });
    }
    catch (error) {
         console.log("REGISTER ERROR:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
const loginUser=async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usermodel.findOne({ email}).select("+password");
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Wrong password" });

        const token=signToken(user);
        res.status(200).json({
            token,
            role: user.role,
        })
        
    } catch (error) {
        console.log("Log In Error",error);
        res.status(500).json({ message: 'Server error' });
    } 
};
const getUser=async(req, res) => {
    try {
        const user = await usermodel.find().select('-password');  
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        res.json(user);
    } catch (error) {
        console.log("Get Error",error)
        res.status(500).json({message:'Server error'});
    }
};
module.exports={registerUser,loginUser,getUser};