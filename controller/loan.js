const Laon = require("../model/loan");

exports.createLoan = async (req, res) => {
    try {
        const {userId, amount} = req.body;

        const currentDate = new Date();

        const loan = await Laon.create({
            userId,
            amount,
            loadDate:currentDate
        })
        res.status(201).json({message:"Loan created successfully"})

    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Failed to create loan"})
    }
}

exports.getLoanByUserIdAndDateBetween = async (req,res)=>{

    try {
        const {userId,startDate,endDate} = req.params;

       console.log(req.params);
       
        const loans = await Laon.findAll({
            where:{
                userId,
                loadDate:{
                    [between]:[startDate,endDate]
                }
            }
        })
        res.status(200).json({loans})
    } catch (error) {

        res.status(500).json({error:"Failed to get loans by date"})
    }
}   
