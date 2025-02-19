const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category");
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     responses:
 *       200:
 *         description: Returns a list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.post("/category", categoryController.createCategory);
router.get("/category", categoryController.getAllCategories);

module.exports = router;
