const { Transaction } = require("sequelize");
const { Product } = require("../model");
const Import = require("../model/import");
const ImportDetail = require("../model/importDetails");
const { Sequelize, sequelize } = require("../models");
const { createResponse } = require("../utils/responseApi");

exports.createImport = async (req, res) => {
  const { importDate } = req.body;
  try {
    // Validate request body
    if (!importDate) {
      return res.status(400).json(createResponse(false, "Import date is required"));
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
    return res.status(201).json(createResponse(true, "Import created successfully", newImport));
  } catch (error) {
    console.error("Error creating import:", error);
    return res.status(500).json(createResponse(false, "Internal server error"));
  }
};

exports.getImportByDate = async (req, res) => {
  const { importDate } = req.query;
  console.log("Fetching import for date:", importDate);
  try {
    const importRecord = await Import.findOne({ where: { importDate } });
    const importDetail = await ImportDetail.findAll({
      where: { importId: importRecord.importId },
      order: [["importDetailId", "ASC"]],
    });

    const importDetailFormatted = importDetail.map((detail) => ({
      id: detail.importDetailId,
      name: detail.productName,
      description: detail.description,
      qty: detail.quantity,
      total_price:
        detail.currency == "USD" ? detail.totalPriceUsd : detail.totalPriceRiel,
      unit_price:
        detail.currency == "USD" ? detail.unitPriceUsd : detail.unitPriceRiel,
      payment_status: detail.paymentStatus,
      currency: detail.currency,
    }));
    const importRecordPlain = importRecord.get({ plain: true });
    return res.status(200).json({
      importRecord: {
        ...importRecordPlain,
        totalRemainingRiel:
          parseFloat(importRecord.totalAmountRiel || 0) -
          parseFloat(importRecord.totalPaidRiel || 0),
        totalRemainingUsd:
          parseFloat(importRecord.totalAmountUsd || 0) -
          parseFloat(importRecord.totalPaidUsd || 0),
      },
      importDetail: importDetailFormatted ?? [],
    });
  } catch (error) {
    console.error("Error fetching import by date:", error);
    return res.status(500).json(createResponse(false, "Internal server error"));
  }
};

exports.updatePaymentStatus = async (req, res) => {
  const { importDetailId, paymentStatus } = req.body;
  const t = await sequelize.transaction();
  try {
    // Validate request body
    if (!importDetailId || !paymentStatus) {
      return res
        .status(400)
        .json(createResponse(false, "Import Detail ID and payment status are required"));
    }
    await ImportDetail.update(
      { paymentStatus },
      { where: { importDetailId }, transaction: t }
    );
    const details = await ImportDetail.findByPk(importDetailId, {
      transaction: t,
    });

    const importRecord = await Import.findByPk(details.importId, {
      transaction: t,
    });
    if (paymentStatus === "PAID") {
      importRecord.update({
        totalPaidUsd:
          parseFloat(importRecord.totalPaidUsd || 0) +
          parseFloat(details.totalPriceUsd || 0),
        totalPaidRiel:
          parseFloat(importRecord.totalPaidRiel || 0) +
          parseFloat(details.totalPriceRiel || 0),
      });
    } else {
      importRecord.update({
        totalPaidUsd:
          parseFloat(importRecord.totalPaidUsd || 0) -
          parseFloat(details.totalPriceUsd || 0),
        totalPaidRiel:
          parseFloat(importRecord.totalPaidRiel || 0) -
          parseFloat(details.totalPriceRiel || 0),
      });
    }
    t.commit();
    return res
      .status(200)
      .json(createResponse(true, "Payment status updated successfully"));
  } catch (error) {
    t.rollback();
    console.error("Error updating payment status:", error);
    return res.status(500).json(createResponse(false, "Internal server error"));
  }
};

exports.createImportDetail = async (req, res) => {
  const { importId, name, qty, price, paymentStatus, currency } = req.body;


  const t = await sequelize.transaction();
  try {
    // Validate request body
    if (!importId || !name || !qty || !price || !paymentStatus || !currency) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const produsct = await Product.findOne({ where: { name } });
    if (!produsct) {
      await Product.create(
        {
          name,
          description: "",
          price: price,
          currency: currency,
        },
        { transaction: t }
      );
    }

    // Create a new import detail record
    const newImportDetail = await ImportDetail.create(
      {
        importId,
        productName: name,
        description: "",
        quantity: qty,
        unitPriceUsd: currency == "USD" ? price : 0,
        unitPriceRiel: currency == "KHR" ? price : 0,
        totalPriceUsd: currency == "USD" ? price * qty : 0,
        totalPriceRiel: currency == "KHR" ? price * qty : 0,
        paymentStatus,
        currency,
      },
      { transaction: t }
    );

    const importRecord = await Import.findByPk(importId, { transaction: t });


    await Import.update(
      {
        totalAmountUsd:
          parseFloat(importRecord.totalAmountUsd || 0) +
          (currency === "USD"
            ? parseFloat(newImportDetail.totalPriceUsd || 0)
            : 0),

        totalAmountRiel:
          parseFloat(importRecord.totalAmountRiel || 0) +
          (currency === "KHR"
            ? parseFloat(newImportDetail.totalPriceRiel || 0)
            : 0)
      },
      {
        where: { importId },
        transaction: t,
      }
    );

    if (paymentStatus === "PAID") {
      await Import.update(
        {
          totalPaidUsd:
            parseFloat(importRecord.totalPaidUsd || 0) +
            (currency === "USD"
              ? parseFloat(newImportDetail.totalPriceUsd || 0)
              : 0),
          totalPaidRiel:
            parseFloat(importRecord.totalPaidRiel || 0) +
            (currency === "KHR"
              ? parseFloat(newImportDetail.totalPriceRiel || 0)
              : 0),
        },
        {
          where: { importId },
          transaction: t,
        }
      );

    }
    await t.commit();
    return res.status(201).json(createResponse(true, "Import detail created successfully", newImportDetail));
  } catch (error) {
    console.error("Error creating import detail:", error);
    await t.rollback();
    return res.status(500).json(createResponse(false, "Internal server error"));
  }
};
