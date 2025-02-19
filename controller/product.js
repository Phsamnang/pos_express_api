const { Product, Category } = require("../model/index");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId } = req.body;

    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ where: { name } });

    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Product with this name already exists" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      categoryId,
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByPk(productId, {
      include: {
        model: Category,
        attributes: ["name"],
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Unable to retrieve product" });
  }
};

exports.getProductsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.categoryId; // Assuming you're getting categoryId from the URL params

    const products = await Product.findAll({
      where: { categoryId: categoryId },
      include: Category,
    });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to retrieve products by category" });
  }
};

exports.getProductsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const products = await Product.findAll({
      where: { categoryId: categoryId },
      include: Category,
    });

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to retrieve products by category" });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: Category,
    });
    const customRespone = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      categoryName: p.Category.name,
    }));

    res.status(200).json(customRespone);
  } catch (err) {
    res.status(500).json(err);
  }
};
