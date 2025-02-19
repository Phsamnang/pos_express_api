const userController = require("../controller/user");
const express = require("express");
const router = express.Router();
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
router.post("/register", userController.register);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login an existing user
 *     description: Authenticates the user and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: JWT token returned after successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token for authentication
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized (incorrect credentials)
 *       500:
 *         description: Server error
 */
router.post("/login", userController.login);
router.post("/create-employee", userController.createEmployee);

module.exports = router;
