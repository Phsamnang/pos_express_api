const express = require("express");
const { getDeliveryOrders, updateDeliveryStatus } = require("../controller/delivery");
const router = express.Router();

router.get("/delivery/foods",getDeliveryOrders)
router.put("/delivery/update",updateDeliveryStatus );   

module.exports = router;