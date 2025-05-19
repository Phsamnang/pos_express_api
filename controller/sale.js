const { NUMBER } = require("sequelize");
const { Sale, Table, SaleItem, Product, MenusPrice, Menus } = require("../model/index");

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
  console.log("orderFood");
  console.log(req.body);
  try {
    const { saleId, menuId, qty,tableId } = req.body;
    // const table=await Table.findByPk(tableId);
    const sale = await Sale.findByPk(saleId);
    const table = await Table.findByPk(tableId);
    const menusPrice = await MenusPrice.findOne({
      where: {
        menusId: menuId,
        tableTypeId: table.tableTypeId,
      },
    });
    const total = qty * menusPrice.price;
    const totalAmount = Number(sale.totalAmount) + Number(total);
    await sale.update({ totalAmount: totalAmount });
    const saleIteme = await SaleItem.create({ 
      saleId: saleId,
      menuId: menuId,
      quantity: qty,
      priceAtSale: menusPrice.price,
    });
    res.status(201).json(saleIteme);
  } catch (err) {
    console.log(err);
  }
};

exports.getByTableId = async (req, res) => {
  try {
    const tableId = req.params.tableId;
    const sales = await Sale.findAll({
      where: { tableId, paymentMethod: "unpaid" }});
    return res.status(200).json(sales);
  } catch (err) {
    console.log(err);
  }
};
