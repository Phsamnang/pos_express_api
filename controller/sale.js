const { NUMBER, Op } = require("sequelize");
const {
  Sale,
  Table,
  SaleItem,
  Product,
  MenusPrice,
  Menus,
} = require("../model/index");
const { DateTime } = require("luxon");
const database = require("../config/database");

exports.createSale = async (req, res) => {
  try {
    const { tableId } = req.body;
    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    } else if (table.status != "available") {
      res.status(400).json({ error: "Table already used" });
    }
    const newCreate = await database.transaction(async (transaction) => {
      const newSale = await Sale.create({
        tableId: tableId,
        totalAmount: 0.0,
        paymentMethod: "unpaid",
      },{ transaction });
      return newSale;
    });
    await table.update({ status: "occupied" });
    res.status(201).json(newCreate);
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

exports.salePayment = async (req, res) => {
  try {
    const { saleId, paymentMethod } = req.body;
    const sale = await Sale.findByPk(saleId);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }
    await sale.update({ paymentMethod: paymentMethod });
    await Table.update(
      { status: "available" },
      { where: { id: sale.tableId } }
    );
    return res
      .status(200)
      .json({ message: "Payment method updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update payment method" });
  }
};

exports.getSaleByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

       if (!startDate || !endDate) {
         return res
           .status(400)
           .json({ error: "startDate and endDate are required" });
       }

       // --- Start of Fix ---
       const start = new Date(startDate);
       const end = new Date(endDate);

       // Set the time to the very end of the day to include all sales
       end.setHours(23, 59, 59, 999);
    const sales = await Sale.findAll({
      where: {
        saleDate: {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Table,
        },
      ],
    });
    const response = sales.map((sale) => ({
      id: sale.id,
      tableId: sale.tableId,
      saleDate: sale.saleDate,
      totalAmount: sale.totalAmount,
      paymentMethod: sale.paymentMethod,
      tableName: sale.Table.tableName,
      referenceId: sale.referenceId,
    }));
    const mainResponse = {
      totalSales: response.length,
      totalAmount: response
        .filter((sale) => sale.paymentMethod !== "unpaid")
        .reduce((acc, sale) => acc + parseFloat(sale.totalAmount), 0),
      unPaidSales: response
        .filter((sale) => sale.paymentMethod === "unpaid")
        .reduce((acc, sale) => acc + parseFloat(sale.totalAmount), 0),
      totalAmountSales: response.reduce(
        (acc, sale) => acc + parseFloat(sale.totalAmount),
        0
      ),
      sales: response,
    };
    return res.status(200).json(mainResponse);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to retrieve sales by date" });
  }
};
