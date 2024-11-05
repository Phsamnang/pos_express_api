const express=require('express')
const productController=require('../controller/product')
const router=express.Router();

router.post('/product',productController.createProduct)
router.get('/product/:id',productController.getProductById)
router.get('/product/category/:categoryId',productController.getProductsByCategoryId)
router.get('/product',productController.getAllProduct)
module.exports=router;