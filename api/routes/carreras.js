const express = require('express');
const router = express.Router();
const carreraControllers = require('../controllers/carreraControllers');

/**
 * @swagger
 * components:
 *   schemas:
 *     Carrera:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           description: El id auto generado de la carrera
 *         nombre:
 *           type: string
 *           description: El nombre de la carrera
 *       example:
 *         id: 1000
 *         nombre: Informática
 */

/**
  * @swagger
  * tags:
  *   name: Carreras
  *   description: Manejo Carreras API
  */

/**
 * @swagger
 * /car:
 *   get:
 *     tags: [Carreras]
 *     summary: Retorna la lista de todas las carreras
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
 *         description: Lista de carrera
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Carrera'
 *                  
 */

router.get('/', carreraControllers.getCarreras);

/**
 * @swagger
 * /car:
 *   post:
 *     summary: Crear nueva carrera
 *     tags: [Carreras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Carrera'
 *     responses:
 *       200:
 *         description: El alumno fue creado sin problemas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alumno'
 *       500:
 *         description: Algún error del servidor
 */


router.post('/', carreraControllers.createCarrera);

/**
 * @swagger
 * /car/{id}:
 *   get:
 *     summary: Retorna carrera según id
 *     tags: [Carreras]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id de la carrera
 *     responses:
 *       200:
 *         description: La descripción de la carrera por id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carrera'
 *       404:
 *         description: La carrera no fue encontrado
 */

router.get('/:id', carreraControllers.getCarrera);


/**
 * @swagger
 * /car/{id}:
 *  put:
 *    summary: Actualizar carrera por id
 *    tags: [Carreras]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id de la carrera
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Carrera'
 *    responses:
 *      200:
 *        description: La carrera fue actualizado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Carrera'
 *      404:
 *        description: La carrera no fue encontrada
 *      500:
 *        description: Some error happened
 */

router.put('/:id', carreraControllers.putCarrera);

/**
 * @swagger
 * /car/{id}:
 *   delete:
 *     summary: Borra la carrera según id
 *     tags: [Carreras]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id de la Carrera
 * 
 *     responses:
 *       200:
 *         description: La Carrera fue borrada
 *       404:
 *         description: La Carrera no fue encontrada
 */

router.delete('/:id', carreraControllers.deleteCarrera);

module.exports = router;