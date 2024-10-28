const tableController=require('../controller/table')
const express=require('express')
const router =express.Router()

router.post('/table',tableController.createTable)


module.exports =router;
