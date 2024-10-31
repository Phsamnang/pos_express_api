const {Sale,Table} =require('../model/index')

exports.createSale=async(req,res)=>{
    try{
     const {tableId}=req.body
     const table=await Table.findByPk(tableId);
     if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }else if(table.status!='available'){
        res.status(400).json({error:'Table already used'})
      }
    const newSale=  await Sale.create({tableId:tableId,totalAmount:0.00})
      await table.update({status:"occupied"})
      res.status(201).json(newSale);
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Failed to create sale' });
    }
}