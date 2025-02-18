const express = require("express");
const router = express.Router();
const {createLoan} = require("../controller/loan");

router.post("/create-loan", createLoan);

module.exports=router