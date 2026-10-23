const express = require("express");
const User = require("../models/User.model");

const addUser = async (req, res) => {
    try {
        const { name, username, password, age} = req.body;

        const existingStudent = await User.findOne({ username });
        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }


        const saveStudent = await User.create({
            name,
            username,
            password,
            age,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: saveStudent
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Failed to create User"
        });
    }
};


const fetchUser=async (req,res)=>{
    const stu=(await User.find());
    res.status(200).json({
      success: true,
      message: "User authenticated, data accessed",
      data:stu
    });
}

module.exports = { addUser ,fetchUser};
