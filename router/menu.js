const express=require("express");
const { createMenu } = require("../controller/menu");
const router=express.Router();

router.post("/menu/create",createMenu)

module.exports=router;