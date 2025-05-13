const express=require("express");
const { createMenu, getAllMenus } = require("../controller/menu");
const router=express.Router();

router.post("/menu/create",createMenu)
router.get("/menu/:tableId",getAllMenus)

module.exports=router;