const Category = require("../model/category");

exports.createCategory=async(req,res)=>{
    try{
        const{name}=req.body;
        const category=await Category.create({name});
        res.status(201).json(category);
    }catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'Unable to create product' }); 
      }
}