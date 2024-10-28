const {Table}=require('../model/index')
exports.createTable=async=async (req,res)=>{
   try{
    const {name}=req.body;
    const table=await Table.create({name})
    res.status(201).json(table);
   }catch(err){

   }
   
}