const{Product,Category} =require('../model/index')

exports.createProduct=async(req,res)=>{
    try{
        const{name,description,price,categoryId}=req.body;

        const product=await Product.create({name,description,price,categoryId});
        res.status(201).json(product);
    
    }catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Unable to create product' }); 
      }
}
exports.getProductById = async (req, res) => {
    try {
      const productId = req.params.id;
    
      const product = await Product.findByPk(productId, {
       include:{
       model:Category,
       attributes: ['name']
    }
      });
 
      
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
   
    res.json( product );
    } catch (err) {
      res.status(500).json({ error:'Unable to retrieve product' });
    }
  };

  exports.getProductsByCategoryId = async (req, res) => {
    try {
      const categoryId = req.params.categoryId; // Assuming you're getting categoryId from the URL params
  
      const products = await Product.findAll({
        where: { categoryId: categoryId } ,
        include: Category
      });
  
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Unable to retrieve products by category' });
    }
  };

  exports.getProductsByCategoryId=async(req,res)=>{
   try{
    const categoryId=req.params.categoryId;
    const products=await Product.findAll({
        where:{categoryId:categoryId},
        include:Category
    })
   
    res.status(200).json(products)
   }catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to retrieve products by category' });
  }
  }