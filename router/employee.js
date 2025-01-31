const express = require('express')
 const router=express.Router();
 const employeeController=require('../controller/employee')

 router.post('/employee',employeeController.createEmployee)
 router.post('/employee/check',employeeController.checkAttendance)

 module.exports=router