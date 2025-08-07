const Import = require("../model/import");
const ImportDetail = require("../model/importDetails");

exports.createImport = async (req, res) => {
    const {importDate}=req.body;
   try{
        // Validate request body
        if (!importDate) {
        return res.status(400).json({ error: "Import date is required" });
        }
        // Create a new import record
        const newImport = await Import.create({
        importDate,
        totalAmountUsd: 0,
        totalAmountRiel: 0,
        totalPaidUsd: 0,
        totalPaidRiel: 0,
        totalDueUsd: 0,
        totalDueRiel: 0,
        });
    
        // Respond with the created import record
        return res.status(201).json(newImport);
   }catch(error){
       console.error("Error creating import:", error);
     return  res.status(500).json({error: "Internal server error"});
   }
}

exports.getImportByDate = async (req, res) => {
  const { importDate } = req.query;
  console.log("Fetching import for date:", importDate);
  try {
    const importRecord = await Import.findOne({ where: { importDate } });
    const importDetail = await ImportDetail.findAll({
      where: { importId: importRecord.importId },
    });

    const importDetailFormatted = importDetail.map((detail) => ({
        id: detail.id,
      name: detail.productName,
      description: detail.description,
        qty: detail.quantity,
        unit_price_usd: detail.unitPriceUsd,
        unit_price_riel: detail.unitPriceRiel,
        total_price_usd: detail.totalPriceUsd,
        total_price_riel: detail.totalPriceRiel,
        payment_status: detail.paymentStatus,

    }));

    return res
      .status(200)
      .json({ importRecord, importDetail: importDetailFormatted ?? [] });
  } catch (error) {
    console.error("Error fetching import by date:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};