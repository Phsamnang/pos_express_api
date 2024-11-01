const express = require('express')
 const router=express.Router();
const categoryController=require('../controller/category')
 router.post('/category',categoryController.createCategory);
 router.get('/category',categoryController.getAllCategories);

 module.exports=router;