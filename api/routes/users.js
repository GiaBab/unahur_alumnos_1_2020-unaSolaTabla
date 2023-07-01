const express = require('express');
const userControllers = require('../controllers/userControllers');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: El id auto generado del User
 *         email:
 *           type: string
 *           description: El email del User
 *         password:
 *           type: string
 *           description: El password del User
 *         id_alumno:
 *           type: string
 *           description: El id del alumno a la cual pertenece
 *       example:
 *         id: 1000
 *         email: Juan
 *         password: Perez
 */

/**
  * @swagger
  * tags:
  *   name: Users
  *   description: Manejo Users API
  */

/**
 * @swagger
 * /user:
 *   get:
 *     tags: [Users]
 *     summary: Retorna la lista de todos los Users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: true       
 *     responses:
 *       200:
 *         description: Lista de Users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *                  
 */

router.get('/', userControllers.getUsers);

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Crear nuevo User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: El User fue creado sin problemas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Algún error del servidor
 */
router.post('/', userControllers.createUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retorna User según id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id del User
 *     responses:
 *       200:
 *         description: La descripción del User por id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: El User no fue encontrado
 */

router.get('/:id', userControllers.getUser);


/**
 * @swagger
 * /user/{id}:
 *  put:
 *    summary: Actualizar User por id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: El User fue actualizado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: El User no fue encontrado
 *      500:
 *        description: Some error happened
 */

router.put('/:id', userControllers.putUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Borra el User según id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: La id del User
 * 
 *     responses:
 *       200:
 *         description: El User fue borrado
 *       404:
 *         description: El User no fue encontrado
 */

router.delete('/:id', userControllers.deleteUser);

module.exports = router;