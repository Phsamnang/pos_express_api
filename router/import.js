const express=require("express");
const { createImport, getImportByDate } = require("../controller/import");
const { get } = require("../app");
const router=express.Router();

router.post("/import/create",createImport)
router.get("/import",getImportByDate)


module.exports = router;