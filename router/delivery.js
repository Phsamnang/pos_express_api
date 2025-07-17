const express = require("express");
const { getDeliveryOrders } = require("../controller/delivery");
const router = express.Router();


router.get("/delivery/foods",getDeliveryOrders)

module.exports = router;