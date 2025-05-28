const { Menus, MenusPrice, TableType, Category, Table } = require("../model");

exports.createMenu = async (req, res) => {  
  
  const { name, categoryId } = req.body;  

  try {
    // Check if a menu with the same name already exists
    const existingMenu = await Menus.findOne({ where: { name } });

    if (existingMenu) {
      return res.status(400).json({ error: "Menu with this name already exists" });
    }

    const menu = await Menus.create({ name, categoryId });
    res.status(201).json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create menu" });
  }

}
exports.getAllMenus = async (req, res) => {
  try { 
    const  tableId = req.params.tableId;
    const menus = await Menus.findAll();
    const tableType = await Table.findOne({
      where: { id: tableId },
    });

    const response = await Promise.all(
      menus.map(async (menu) => {
        try {
          const price = await MenusPrice.findOne({
            where: {
              menus_id: menu.id,
              table_type_id: tableType.table_type_id,
            },
          }).then((price) => {
            return price ? price.price : null;
          });
          return {
            id: menu.id,
            name: menu.name,
            price: price,
            category: await Category.findOne({
              where: { id: menu.categoryId },
            }).then((category) => category?.name || null),
          };
        } catch (err) {
         return err;
        }
      })
    );
    const responseWithPrice = response.filter((menu) => menu.price !== null);
    return  res.status(200).json(responseWithPrice);
  } catch (err) {
    console.error(err);
   return res.status(500).json({ error: "Failed to fetch menus" });
  } 
} 

exports.getAllMenusWithPrice = async (req, res) => {
  try {
    const menus = await Menus.findAll({
      include:[
        {
          model:MenusPrice,
          include:[
            {
              model:TableType,
            }
          ]
        },
      ]
    });
    const response = await Promise.all( menus.map(async (menu) => {
    const category = await Category.findByPk(menu.categoryId);
      return {
        id: menu.id,
        name: menu.name,
        category:category.name,
        prices: menu.menus_prices.map((price) => ({
          price: price.price,
          tableType: price.table_type.id,
        })),
      };

    })); 

    return res.status(200).json(response);

  }catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch menus with price" });
  }
}

exports.updateMenuPrice = async (req, res) => {
  const { menuId, tableTypeId, price } = req.body;

  try {
    // Check if the menu exists
    const menu = await Menus.findByPk(menuId);
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    // Check if the price entry already exists
    const existingPrice = await MenusPrice.findOne({
      where: { menus_id: menuId, table_type_id: tableTypeId },
    });

    if (existingPrice) {
      // Update the existing price
      existingPrice.price = price;
      await existingPrice.save();
      return res.status(200).json({ message: "Menu price updated successfully" });
    } else {
      // Create a new price entry
      await MenusPrice.create({
        menus_id: menuId,
        table_type_id: tableTypeId,
        price,
      });
      return res.status(201).json({ message: "Menu price created successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update menu price" });
  } 
}