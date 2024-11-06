const Category = require("../model/category");

exports.createCategory = async (req, res) => {
    try {
      const { name } = req.body;
  
      // Check if a category with the same name already exists
      const existingCategory = await Category.findOne({ where: { name } });
  
      if (existingCategory) {
        return res.status(400).json({ error: 'Category with this name already exists' });
      }
  
      const category = await Category.create({ name });
      res.status(201).json(category);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create category' });
    }
  };

exports.getAllCategories=async(req,res)=>{
    try{
       const category=await Category.findAll()
        res.status(201).json(category);
    }catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Unable to create product' }); 
      }
}