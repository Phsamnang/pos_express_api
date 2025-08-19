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
const { createResponse } = require("../utils/responseApi");

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
      const newSale = await Sale.create(
        {
          tableId: tableId,
          totalAmount: 0.0,
          paymentMethod: "unpaid",
        },
        { transaction }
      );
      return newSale;
    });
    await table.update({ status: "occupied" });
    res
      .status(201)
      .json(createResponse(true, "Sale created successfully", newCreate));
  } catch (err) {
    console.error(err);
    return res.status(500).json(createResponse(false, "Failed to create sale"));
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

    return res
      .status(201)
      .json(createResponse(true, "Food ordered successfully", saleIteme));
  } catch (err) {
    console.log(err);

    return res.status(500).json(createResponse(false, "Failed to order food"));
  }
};

exports.getByTableId = async (req, res) => {
  try {
    const tableId = req.params.tableId;
    const sales = await Sale.findOne({
      where: { tableId, paymentMethod: "unpaid" },
    });
    return res
      .status(200)
      .json(createResponse(true, "Sales fetched successfully", sales));
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
          as: "menus",
        },
      ],
      order: [["id", "ASC"]],
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
        name: item.menus.name,
      };
    });
    return res
      .status(200)
      .json(
        createResponse(true, "Sale fetched successfully", {
          saleItemResponse,
          totalAmount,
          paidAmount: sale.paidAmount,
          invoice: sale.referenceId,
          saleDate: sale.saleDate,
        })
      );
  } catch (err) {
    console.log(err);
    return res.status(500).json(createResponse(false, "Failed to get sale"));
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
      return res.status(404).json(createResponse(false, "Sale not found"));
    }

    const totalAmount =
      Number(sale.totalAmount) -
      Number(saleItem.priceAtSale * saleItem.quantity);
    await sale.update({ totalAmount: totalAmount });
    await saleItem.destroy();
    const io = req.app.get("io");
    io.emit("foodOrdered", {
      order_id: saleItem.id,
    });
    return res
      .status(200)
      .json(createResponse(true, "Sale item removed successfully"));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(createResponse(false, "Failed to remove sale item"));
  }
};

exports.salePayment = async (req, res) => {
  try {
    const { saleId, paymentMethod } = req.body;
    const sale = await Sale.findByPk(saleId);
    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }
    await sale.update({
      paymentMethod: paymentMethod,
      paidAmount: sale.totalAmount,
    });
    await SaleItem.update(
      { delivery_sts: "delivered" },
      { where: { saleId: saleId } }
    );
    return res
      .status(200)
      .json(createResponse(true, "Payment method updated successfully"));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(createResponse(false, "Failed to update payment method"));
  }
};

exports.getSaleByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json(createResponse(false, "startDate and endDate are required"));
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
      totalAmount:{
        [Op.ne]: 0
      }
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
    return res
      .status(200)
      .json(createResponse(true, "Sales retrieved successfully", mainResponse));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(createResponse(false, "Failed to retrieve sales by date"));
  }
};

exports.getPrinter = async (req, res) => {
  try {
    const saleId = req.params.saleId;
    const printers = await Sale.findByPk(saleId);
    const table = await Table.findByPk(printers.tableId);
    const query = `
      select 
          m.name as name,
          sum(si.quantity) as qty,
          mp.price as sale_at_price,
          m.img as img
      from tb_sale s
          left join tb_sale_item si on s.id = si.sale_id
          left join tb_menus m on si.menus_id = m.id
          left join tb_table t on s.table_id = t.id
          left join tb_table_type tbt on t.table_type_id = tbt.id
          left join tb_menus_price mp 
              on (m.id, tbt.id) = (mp.menus_id, mp.table_type_id)
      where s.id = :saleId
      group by (s.ref_id, t.id, mp.price, m.name, t.table_name, m.img)
    `;

    const results = await database.query(query, {
      replacements: { saleId }, // safely injects variable
      type: database.QueryTypes.SELECT, // only rows, no metadata
    });

    const response = {
      inv_no: printers.referenceId,
      ttl_amt: printers.totalAmount,
      table_name: table.tableName,
      sale_dt: printers.saleDate,
      items: results,
    };

    if (!results) {
      return res.status(404).json(createResponse(false, "Printers not found"));
    }
    return res
      .status(200)
      .json(createResponse(true, "Printers fetched successfully", response));
  } catch (err) {
    console.error("Error fetching printers:", err);
    return res.status(500).json(createResponse(false, "Internal server error"));
  }
};

exports.finishOrder = async (req, res) => {
  const { saleId } = req.params;

  try {
    // Check if the sale exists
    const sale = await Sale.findByPk(saleId);
    if(sale.paymentMethod === "unpaid") {
       sale.paymentMethod = "paid";
      sale.save();
    }
    if (!sale) {
      return res.status(404).json(createResponse(false, "Sale not found"));
    }

    // Update the sale status to finished
    await Table.update(
      { status: "available" },
      { where: { id: sale.tableId } }
    );

    return res
      .status(200)
      .json(createResponse(true, "Order finished successfully"));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(createResponse(false, "Failed to finish order"));
  }
};
