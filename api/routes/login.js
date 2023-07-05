const express = require('express');
const router = express.Router();
const loginControllers = require('../controllers/loginControllers');

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: El email del User
 *         password:
 *           type: string
 *           description: El password del User
 *       example:
 *         email: Juan
 *         password: Perez
 */
/**
  * @swagger
  * tags:
  *   name: Login
  *   description: Manejo Login API
  */
/**
 * @swagger
 * /login:
 *   get:
 *     tags: [Login]
 *     summary: logea un user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: La descripción del User por id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       404:
 *         description: El User no fue encontrado
 */


router.get('/', loginControllers.getLogin);

module.exports = router;