const { NUMBER } = require("sequelize");
const {
  Sale,
  Table,
  SaleItem,
  Product,
  MenusPrice,
  Menus,
} = require("../model/index");
const { DateTime } = require("luxon");

exports.createSale = async (req, res) => {
  try {
    const { tableId } = req.body;
    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    } else if (table.status != "available") {
      res.status(400).json({ error: "Table already used" });
    }
    const newSale = await Sale.create({
      tableId: tableId,
      totalAmount: 0.0,
      paymentMethod: "unpaid",
    });
    await table.update({ status: "occupied" });
    res.status(201).json(newSale);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create sale" });
  }
};

exports.orderFood = async (req, res) => {
  try {
    const { saleId, menusId, qty, tableId } = req.body;
    // const table=await Table.findByPk(tableId);
    const sale = await Sale.findByPk(saleId);
    const table = await Table.findByPk(tableId);
    const menus = await Menus.findByPk(menusId);

    const isCooked = menus.isCooked;

    const menusPrice = await MenusPrice.findOne({
      where: {
        menusId: menusId,
        tableTypeId: table.tableTypeId,
      },
    });
    const total = qty * menusPrice.price;

    console.log("====================================");
    console.log("total", total);
    console.log("====================================");
    await sale.update({
      totalAmount: Number(sale.totalAmount) + Number(total),
    });
    const saleIteme = await SaleItem.create({
      saleId: saleId,
      menusId: menusId,
      quantity: qty,
      priceAtSale: menusPrice.price,
      delivery_sts: isCooked ? "pending" : "shipped",
      startOrderTime: DateTime.now().setZone("Asia/Phnom_Penh").toJSDate(), // Set the current time as the start order time
    });
    const io = req.app.get("io");

    if (isCooked) {
      io.emit("foodOrdered", {
        order_id: saleIteme.id,
      });
    } else {
      io.emit("foodDelivery", {
        message: "Delivery status updated successfully",
      });
    }

    return res.status(201).json(saleIteme);
  } catch (err) {
    console.log(err);

    return res.status(500).json({ error: "Failed to order food" });
  }
};

exports.getByTableId = async (req, res) => {
  try {
    const tableId = req.params.tableId;
    const sales = await Sale.findOne({
      where: { tableId, paymentMethod: "unpaid" },
    });
    return res.status(200).json(sales);
  } catch (err) {
    console.log(err);
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const saleId = req.params.saleId;
    const saleItem = await SaleItem.findAll({
      where: { saleId },
      include: [
        {
          model: Menus,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!saleItem) {
      return res.status(404).json({ error: "Sale not found" });
    }
    const sale = await Sale.findByPk(saleId);
    const totalAmount = sale.totalAmount;
    const saleItemResponse = saleItem.map((item) => {
      return {
        id: item.id,
        quantity: item.quantity,
        priceAtSale: item.priceAtSale,
        name: item.menu.name,
      };
    });
    return res.status(200).json({ saleItemResponse, totalAmount });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to get sale" });
  }
};

exports.removeSaleItem = async (req, res) => {
  try {
    const { saleItemId } = req.params;
    const saleItem = await SaleItem.findByPk(saleItemId);
    if (!saleItem) {
      return res.status(404).json({ error: "Sale item not found" });
    }
    const sale = await Sale.findByPk(saleItem.saleId);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    const totalAmount =
      Number(sale.totalAmount) -
      Number(saleItem.priceAtSale * saleItem.quantity);
    await sale.update({ totalAmount: totalAmount });
    await saleItem.destroy();
    return res.status(200).json({ message: "Sale item removed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to remove sale item" });
  }
};
