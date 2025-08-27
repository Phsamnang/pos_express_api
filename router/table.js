const tableController = require("../controller/table");
const express = require("express");
const router = express.Router();

router.post("/table", tableController.createTable);
router.get("/table", tableController.getAllTable);
router.get("/table/type", tableController.getTableType);
router.post("/table/type", tableController.createTableType);
router.put("/table/:id", tableController.updateTable);

module.exports = router;
