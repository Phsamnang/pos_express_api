const express = require("express");
const { getFoodOrder } = require("../controller/chef");
const router = express.Router();
router.get("/chef/foods", getFoodOrder);


module.exports = router;