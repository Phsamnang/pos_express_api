const { Op } = require("sequelize");
const { SaleItem, Menus } = require("../model");
const { getTableName } = require("./chef");

exports.getDeliveryOrders = async (req, res, next) => {

    try {
      const foods = await SaleItem.findAll({
        where: {
          [Op.or]: [{ delivery_sts: "shipped" }],
        },
        include: [
          {
            model: Menus
          },
        ],
        order: [["startOrderTime", "ASC"]],
      });
      const foodOrders = await Promise.all(foods.map(async (food) => ({
        id: food.id,
        name: food.menu.name,
        qty: food.quantity,
        price: food.price,
        table_name: await getTableName(food.saleId),
        start_time: food.startOrderTime,
        delivery_sts: food.delivery_sts,
      })));
      return res.status(200).json(foodOrders);
    } catch (error) {
        console.log('====================================');
        console.log("Error fetching delivery orders:", error);
        console.log('====================================');
        return res.status(500).json({ message: "Errors get items", error });
    }
}