const { Menus, MenusPrice } = require("../model");

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
    const { tableId } = req.params;
    const menus = await Menus.findAll({
      include: [
        {
          model: MenusPrice,
          as: "prices",
          required: false,
        },
      ],
    });
    return  res.status(200).json(menus);
  } catch (err) {
    console.error(err);
   return res.status(500).json({ error: "Failed to fetch menus" });
  } 
}