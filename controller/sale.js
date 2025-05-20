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
    const { saleId, menusId, qty,tableId } = req.body;
    // const table=await Table.findByPk(tableId);
    const sale = await Sale.findByPk(saleId);
    const table = await Table.findByPk(tableId);

    const menusPrice = await MenusPrice.findOne({
      where: {
        menusId: menusId,
        tableTypeId: table.tableTypeId,
      },
    });

    console.log("menusPrice",menusPrice);
    const total = qty * menusPrice.price;
    const totalAmount = Number(sale.totalAmount) + Number(total);
    await sale.update({ totalAmount: totalAmount });
    const saleIteme = await SaleItem.create({ 
      saleId: saleId,
      menusId: menusId,
      quantity: qty,
      priceAtSale: menusPrice.price,
    });
    res.status(201).json(saleIteme);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to order food" });
  }
};

exports.getByTableId = async (req, res) => {
  try {
    const tableId = req.params.tableId;
    const sales = await Sale.findOne({
      where: { tableId, paymentMethod: "unpaid" }});
    return res.status(200).json(sales);
  } catch (err) {
    console.log(err);
  }
};

exports.getSaleById = async (req, res) => {

  
  try {

    const saleId = req.params.saleId;
   const saleItem= await SaleItem.findAll({
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
}
