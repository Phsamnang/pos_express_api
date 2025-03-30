const { Menus, MenusPrice } = require("../model");

exports.getMenusByTableId = async (req, res) => {
  
  try {
 

    return res.status(200).json(menus);
  } catch (err) {
    res.status(500).json(err);
  }
};