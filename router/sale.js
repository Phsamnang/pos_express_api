const saleController = require("../controller/sale");
const express = require("express");
const router = express.Router();

router.post("/sale", saleController.createSale);
router.post("/order", saleController.orderFood);
router.get("/sale/:tableId", saleController.getByTableId);
router.get("/sale/:saleId/items", saleController.getSaleById);

module.exports = router;
