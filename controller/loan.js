const Laon = require("../model/loan");
const { Op } = require("sequelize");
const User = require("../model/user");
const { createResponse } = require("../utils/responseApi");
exports.createLoan = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const currentDate = new Date();

    const loan = await Laon.create({
      userId,
      amount,
      loadDate: currentDate,
    });
    res.status(201).json(createResponse(true, "Loan created successfully", loan));
  } catch (error) {
    console.error(error);
    res.status(500).json(createResponse(false, "Failed to create loan"));
  }
};

exports.getLoanByUserIdAndDateBetween = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.params;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    const loans = await Laon.findAll({
      where: {
        userId,
        loadDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    if (loans.length == 0) {
      return res.status(404).json(createResponse(false, "Loan is not found!"));
    }
    return res.status(200).json(createResponse(true, "Loans retrieved successfully", {
      name: user.name,
      loans: loans.map((l) => ({
        amt: l.amount,
        loan_date: l.loadDate,
      })),
    }));
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json(createResponse(false, "Failed to get loans"));
  }
};
