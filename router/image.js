const express = require('express');
const router = express.Router();
const multer = require("multer");
const { uploadImage } = require('../controller/imageUpload');
const upload = multer({
  storage: multer.memoryStorage(),
});
router.post('/upload', upload.single('file'), uploadImage);

module.exports = router;