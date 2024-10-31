const saleController =require('../controller/sale')
const express=require('express')
const router=express.Router()

router.post('/sale',saleController.createSale);

module.exports=router
