const express = require("express");
const router = express.Router();
const {
  createLoan,
  getLoanByUserIdAndDateBetween,
} = require("../controller/loan");

router.post("/create-loan", createLoan);
router.get(
  "/get-loan/:userId/:startDate?/:endDate?",
  getLoanByUserIdAndDateBetween
);

module.exports = router;
