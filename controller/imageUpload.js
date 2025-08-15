const imagekit = require("../config/imagekit");
const { createResponse } = require("../utils/responseApi");

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload a file.",
    });
  }
  try {
    const response = await imagekit.upload({
      file: req.file.buffer, // The file buffer
      fileName: req.file.originalname, // The original file name
      folder: "menus", // Optional: specify a folder in ImageKit
      useUniqueFileName: true, // Optional: specify a folder in ImageKit
    });

    return res.status(200).json(createResponse(true, "Image uploaded successfully", {
      url: response.url,
      fileId: response.fileId,
    }));    
   
  } catch (error) {
    console.error("Error uploading image:", error);
   return res.status(500).json(createResponse(false, "Failed to upload image"));
  }
};
