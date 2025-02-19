const Laon = require("../model/loan");
const { Op } = require("sequelize");
const User = require("../model/user");
exports.createLoan = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const currentDate = new Date();

    const loan = await Laon.create({
      userId,
      amount,
      loadDate: currentDate,
    });
    res.status(201).json({ message: "Loan created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create loan" });
  }
};

exports.getLoanByUserIdAndDateBetween = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.params;
    const user = await User.findByPk(userId);
    const loans = await Laon.findAll({
      where: {
        userId,
        loadDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    res.status(200).json({
      name: user.name,
      loans: loans.map((l) => ({
        amt: l.amount,
        laon_date: l.loadDate,
      })),
    });
  } catch (error) {
    console.log(error, "error");

    res.status(500).json({ error: "Failed to get loans by date" });
  }
};
