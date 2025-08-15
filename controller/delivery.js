const { Op } = require("sequelize");
const { SaleItem, Menus } = require("../model");
const { getTableName } = require("./chef");
const { createResponse } = require("../utils/responseApi");

exports. getDeliveryOrders = async (req, res, next) => {
  try {
    const foods = await SaleItem.findAll({
      where: {
        [Op.or]: [{ delivery_sts: "shipped" }],
      },
      include: [
        {
          model: Menus,
        },
      ],
      order: [["startOrderTime", "ASC"]],
    });
    const foodOrders = await Promise.all(
      foods.map(async (food) => ({
        id: food.id,
        name: food.menu.name,
        qty: food.quantity,
        price: food.price,
        table_name: await getTableName(food.saleId),
        start_time: food.startOrderTime,
        delivery_sts: food.delivery_sts,
      }))
    );
    return res.status(200).json(createResponse(true, "Fetched delivery orders successfully", foodOrders));
  } catch (error) {
    console.log("====================================");
    console.log("Error fetching delivery orders:", error);
    console.log("====================================");
    return res.status(500).json(createResponse(false, "Errors get items", error));
  }
};

exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const { id, status } = req.body;

    console.log("====================================");
    console.log("Updating delivery status for ID:", id, "to status:", status);
    console.log("====================================");

    // Validate input
    if (!id || !status) {
      return res.status(400).json(createResponse(false, "ID and status are required"));
    }

    // Check if the status is valid
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json(createResponse(false, "Invalid status"));
    }

    // Update the delivery status
    const updatedItem = await SaleItem.update(
      {
        delivery_sts: status,
        // Optionally, you can also update the completedTime if the status is 'delivered'
        completedTime: status === "delivered" ? new Date() : null,
      },
      { where: { id } }
    );

    if (updatedItem[0] === 0) {
      return res.status(404).json(createResponse(false, "Sale item not found"));
    }

    return res
      .status(200)
      .json(createResponse(true, "Delivery status updated successfully"));
  } catch (error) {
    console.log("====================================");
    console.log("Error updating delivery status:", error);
    console.log("====================================");
    return res
      .status(500)
      .json(createResponse(false, "Error updating delivery status", error));
  }
};
