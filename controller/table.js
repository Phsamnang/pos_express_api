const database = require("../config/database");
const { Table, TableType, Sale } = require("../model/index");
const { createResponse } = require("../utils/responseApi");
exports.createTable = async (req, res) => {
  try {
    const { name,typeId } = req.body;
    const existingTable = await Table.findOne({ where: { tableName: name } });
    if (existingTable) {
      return res
        .status(400)
        .json({ error: "Table with this name already exists" });
    }
    const table = await Table.create({ tableName: name , tableTypeId: typeId });
    res.status(201).json(table);
  } catch (err) {
    console.log(err);
  }
};

exports.getAllTable = async (req, res) => {
  try {
    const tables = await Table.findAll({
      order: [["tableName", "ASC"]],
    });

    const response = await Promise.all(
      tables.map(async (table) => {
        try {
          const tableType = await TableType.findOne({
            where: { id: table.tableTypeId },
          });
          const sale = await Sale.findOne({
            where: { tableId: table.id, paymentMethod: "unpaid" },
          });
          return {
            id: table.id,
            name: table.tableName,
            status: table.status,
            category: tableType ? tableType.name : null,
            ttle_amount: sale ? sale.totalAmount : 0,
            createdAt: table.createdAt,
          };
        } catch (err) {
          console.error("Error fetching table type:", err);
        return res.status(500).json(createResponse(false, "Internal server error"));
        }
      })
    );

    return res.status(200).json(createResponse(true, "Tables fetched successfully", response));
  } catch (err) {
    console.error("Error fetching tables:", err);
    return res.status(500).json(createResponse(false, "Internal server error"));
  }
};

exports.getTableType = async (req, res) => {
  try {
    const tableTypes = await TableType.findAll();
    const response = tableTypes.map((tableType) => ({
      id: tableType.id,
      name: tableType.name,
    }));
    return res.status(200).json(createResponse(true, "Table types fetched successfully", response));
  } catch (err) {
    console.error("Error fetching table types:", err);
    return res.status(500).json(createResponse(false, "Internal server error"));
  }
};


exports.createTableType = async (req, res) => {
  try {
    const { name } = req.body;
    const existingTableType = await TableType.findOne({ where: { name } });
    if (existingTableType) {
      return res
        .status(400)
        .json({ error: "Table type with this name already exists" });
    }
    const tableType = await TableType.create({ name });
   return res.status(201).json(createResponse(true, "Table type created successfully", tableType));
  } catch (err) {
    console.error("Error creating table type:", err);
   return res.status(500).json(createResponse(false, "Internal server error"));
  }
};

 