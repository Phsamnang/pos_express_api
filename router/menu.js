const express=require("express");
const { createMenu, getAllMenus, getAllMenusWithPrice, updateMenuPrice, updateMenuImage } = require("../controller/menu");
const router=express.Router();

router.post("/menu/create",createMenu)
router.get("/menu/:tableId",getAllMenus)
router.get("/menus",getAllMenusWithPrice)
router.post("/menu/update",updateMenuPrice) 
router.post('/menu/:menuId/image',updateMenuImage)

module.exports=router;