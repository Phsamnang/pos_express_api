const { NUMBER } = require("sequelize");
const { Sale, Table, SaleItem, Product } = require("../model/index");

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
    const { saleId, productId, qty } = req.body;
    // const table=await Table.findByPk(tableId);
    const product = await Product.findByPk(productId);
    const sale = await Sale.findByPk(saleId);
    const total = qty * product.price;
    const totalAmount = Number(sale.totalAmount) + Number(total);
    await sale.update({ totalAmount: totalAmount });
    const saleIteme = await SaleItem.create({
      saleId: saleId,
      productId: productId,
      quantity: qty,
      priceAtSale: product.price,
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
      where: { tableId, paymentMethod: "unpaid" },
      include: [
        {
          model: SaleItem,
          include: [
            {
              model: Product,
            },
          ],
        },
      ],
    });
    const formatSale = sales.map((sale) => ({
      ...sale.toJSON(),
      SaleItems: sale.SaleItems.map((item) => ({
        ...item.toJSON(),
        Product: item.Product.name,
      })),
    }));
    res.json(formatSale);
  } catch (err) {
    console.log(err);
  }
};
