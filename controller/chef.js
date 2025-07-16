const { Op, where } = require("sequelize");
const { SaleItem, Menus, Sale, Table } = require("../model");

exports.getFoodOrder= async (req, res,next) => {

    try{
      const foods = await SaleItem.findAll({
        where: {
            [Op.or]: [

              { delivery_sts: "pending" },
              { delivery_sts: "processing" },
            ],
        },
        include: [
          {
            model: Menus,
           where: {
             isCooked :true,
          }
        },
      ]
      });

        const foodOrders = await Promise.all(foods.map(async (food) => ({
        id: food.id,
        food_name: food.menu.name,
        qty: food.quantity,
        start_time: food.startOrderTime,
        delivery_sts: food.delivery_sts,
        table_name: await getTableName(food.saleId),
        
      })));
     return res.status(200).json(foodOrders);
    }catch (error) {
        console.error("Error fetching food orders:", error);
        res.status(500).json({ error: "Internal server error" });
        next(error); // Pass the error to the next middleware for centralized error handling
    }       

}


const getTableName = async (saleId) => {
  try {
    const sale = await Sale.findByPk(saleId, {
      include: [{ model: Table, attributes: ["tableName"] }],
    });
    return sale.Table.tableName;

  } catch (error) {
    console.error("Error fetching table name:", error);
    return "Unknown Table";
  }
}