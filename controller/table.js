const { Table, TableType } = require("../model/index");
exports.createTable = async (req, res) => {
  try {
    const { name } = req.body;
    const existingTable = await Table.findOne({ where: { tableName: name } });
    if (existingTable) {
      return res
        .status(400)
        .json({ error: "Table with this name already exists" });
    }
    const table = await Table.create({ tableName: name });
    res.status(201).json(table);
  } catch (err) {
    console.log(err);
  }
};

exports.getAllTable = async (req, res) => {
  try {
    const tables = await Table.findAll({
      order: [["tableTypeId", "ASC"]],
    });

    const response = await Promise.all(
      tables.map(async (table) => {
        try {
          const tableType = await TableType.findOne({
            where: { id: table.tableTypeId },
          });
          return {
            id: table.id,
            name: table.tableName,
            status: table.status,
            category: tableType ? tableType.name : null,
          };
        } catch (err) {
          console.error("Error fetching table type:", err);
          return {
            id: table.id,
            name: table.tableName,
            status: table.status,
            category: null,
          };
        }
      })
    );

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching tables:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getTableType = async (req, res) => {
  try {
    const tableTypes = await TableType.findAll();
    const response = tableTypes.map((tableType) => ({
      id: tableType.id,
      name: tableType.name,
    }));
    return res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching table types:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
