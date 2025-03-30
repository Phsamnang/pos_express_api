const express=require("express");
const { getMenusByTableId } = require("../controller/menu");
const router=express.Router();

router.get('/menus/:tableId',getMenusByTableId)

module.exports=router;