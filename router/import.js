const express=require("express");
const { createImport, getImportByDate, updatePaymentStatus, createImportDetail } = require("../controller/import");
const { get } = require("../app");
const router=express.Router();

router.post("/import/create",createImport)
router.get("/import",getImportByDate)
router.put("/import/update-payment-status",updatePaymentStatus)
router.post("/import/product",createImportDetail)


module.exports = router;