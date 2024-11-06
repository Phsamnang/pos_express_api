const {Table}=require('../model/index')
exports.createTable=async=async (req,res)=>{
   try{
      const { name } = req.body;
      const existingTable = await Table.findOne({ where: { tableName: name } });
      if (existingTable) {
        return res.status(400).json({ error: 'Table with this name already exists' });
      }
      const table = await Table.create({ tableName: name });
      res.status(201).json(table);
   }catch(err){
    
      console.log(err);
   
   }
   
} 