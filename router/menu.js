const express=require("express");
const { createMenu, getAllMenus, getAllMenusWithPrice, updateMenuPrice } = require("../controller/menu");
const router=express.Router();

router.post("/menu/create",createMenu)
router.get("/menu/:tableId",getAllMenus)
router.get("/menus",getAllMenusWithPrice)
router.post("/menu/update",updateMenuPrice) 
module.exports=router;