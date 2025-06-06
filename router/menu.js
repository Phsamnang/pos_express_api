const express=require("express");
const { createMenu, getAllMenus, getAllMenusWithPrice, updateMenuPrice, updateMenuImage } = require("../controller/menu");
const multer = require("multer");
const router=express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});
router.post("/menu/create",createMenu)
router.get("/menu/:tableId",getAllMenus)
router.get("/menus",getAllMenusWithPrice)
router.post("/menu/update",updateMenuPrice) 

router.post('/menu/:menuId/image',upload.single('image'),updateMenuImage)

module.exports=router;