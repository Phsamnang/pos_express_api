const {Table}=require('../model/index')
exports.createTable=async (req,res)=>{
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

exports.getAllTable=async(req,res)=>{
   try {
     const table = await Table.findAll();
     res.status(200).json(table);
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: err});
   }
}