const express = require("express");
const Product = require("../models/Product.model");
const jwtauthentication=require("../config/jwtauthentication");
const {createProduct,updateProdcut}=require("../controller/Product.controller");
const router = express.Router();

router.post("/", jwtauthentication,createProduct);
router.put("/:id", jwtauthentication,updateProdcut);

module.exports = router;
