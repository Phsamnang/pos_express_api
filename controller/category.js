const Category = require("../model/category");
const { createResponse } = require("../utils/responseApi");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ where: { name } });

    if (existingCategory) {
      return res
        .status(400)
        .json(createResponse(false, "Category with this name already exists"));
    }

    const category = await Category.create({ name });
    res.status(201).json(createResponse(true, "Category created successfully", category));
  } catch (err) {
    console.error(err);
   return res.status(500).json(createResponse(false, "Failed to create category"));
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const category = await Category.findAll();
    return res.status(200).json(createResponse(true, "Fetched categories successfully", category));
  } catch (err) {
    console.error(err);
    return res.status(500).json(createResponse(false, "Unable to fetch categories"));
  }
};
