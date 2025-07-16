const express = require("express");
const { getFoodOrder, updateDeliveryStatus } = require("../controller/chef");
const router = express.Router();
router.get("/chef/foods", getFoodOrder);
router.put("/chef/foods", updateDeliveryStatus);


module.exports = router;