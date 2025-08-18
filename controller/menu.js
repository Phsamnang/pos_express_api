const imagekit = require("../config/imagekit");
const { Menus, MenusPrice, TableType, Category, Table } = require("../model");
const { createResponse } = require("../utils/responseApi");

exports.createMenu = async (req, res) => {
  const { name, categoryId,isCooked } = req.body;
  try {
    // Check if a menu with the same name already exists
    const existingMenu = await Menus.findOne({ where: { name } });

    if (existingMenu) {
      return res
        .status(400)
        .json({ error: "Menu with this name already exists" });
    }

    const menu = await Menus.create({ name, categoryId,isCooked });
    res.status(201).json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create menu" });
  }
};
exports.getAllMenus = async (req, res) => {
  try {
    const tableId = req.params.tableId;
    const menus = await Menus.findAll();
    const tableType = await Table.findOne({
      where: { id: tableId },
    });

    const response = await Promise.all(
      menus.map(async (menu) => {
        try {
          const price = await MenusPrice.findOne({
            where: {
              menusId: menu.id,
              tableTypeId: tableType.tableTypeId,
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
            img: menu.img || null,
          };
        } catch (err) {
          return err;
        }
      })
    );
    const responseWithPrice = response.filter((menu) => menu.price !== null);
    return res.status(200).json(createResponse(true, "Menus fetched successfully", responseWithPrice));
  } catch (err) {
    console.error(err);
    return res.status(500).json(createResponse(false, "Failed to fetch menus"));
  }
};

exports.getAllMenusWithPrice = async (req, res) => {
  try {
    const menus = await Menus.findAll({
      include: [
        {
          model: MenusPrice,
          as: "prices",
          include: [
            {
              model: TableType,
            },
          ],
        },
      ],
    });
    const response = await Promise.all(
      menus.map(async (menu) => {
        const category = await Category.findByPk(menu.categoryId);
        return {
          id: menu.id,
          name: menu.name,
          category: category.name,
          prices: menu.prices.map((price) => ({
            price: price.price,
            tableType: price.table_type.id,
          })),
          image: menu.img,
          preparationTime: menu.cookTime,
        };
      })
    );

    return res.status(200).json(createResponse(true, "Menus fetched successfully", response));
  } catch (err) {
    console.error(err);
    return res.status(500).json(createResponse(false, "Failed to fetch menus with price"));
  }
};

exports.updateMenuPrice = async (req, res) => {
  const { menuId, tableTypeId, price } = req.body;

  try {
    // Check if the menu exists
    const menu = await Menus.findByPk(menuId);
    if (!menu) {
      return res.status(404).json(createResponse(false, "Menu not found"));
    }

    // Check if the price entry already exists
    const existingPrice = await MenusPrice.findOne({
      where: { menusId: menuId, tableTypeId: tableTypeId },
    });

    if (existingPrice) {
      // Update the existing price
      existingPrice.price = price;
      await existingPrice.save();
      return res
        .status(200)
        .json(createResponse(true, "Menu price updated successfully"));
    } else {
      await MenusPrice.create({
        menusId: menuId,
        tableTypeId,
        price,
      });
      return res
        .status(201)
        .json(createResponse(true, "Menu price created successfully"));
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(createResponse(false, "Failed to update menu price"));
  }
};
exports.updateMenuImage = async (req, res) => {
  try {
    const menuId = req.params.menuId;
    const file = req.file; // Assuming you're using multer for file uploads

    if (!file) {
      return res.status(400).json(createResponse(false, "No image file provided"));
    }

    // Check if the menu exists
    const menu = await Menus.findByPk(menuId);
    if (!menu) {
      return res.status(404).json(createResponse(false, "Menu not found"));
    }

    // Upload the image to ImageKit
    const response = await imagekit.upload({
      file: file.buffer, // The file buffer
      fileName: file.originalname, // The original file name
      folder: "menus", // Optional: specify a folder in ImageKit
      useUniqueFileName: true, // Optional: specify a folder in ImageKit
    });

    menu.img = response.url;
    await menu.save();

    return res.status(200).json(createResponse(true, "Menu image updated successfully", {
      imgUrl: response.url,
    }));
  } catch (err) {
    console.error(err);
    return res.status(500).json(createResponse(false, "Failed to update menu image"));
  }
};
