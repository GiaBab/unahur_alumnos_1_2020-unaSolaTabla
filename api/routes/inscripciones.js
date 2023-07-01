const express = require('express');
const router = express.Router();
const inscripcionesControllers = require('../controllers/inscripcionesControllers');

/**
 * @swagger
 * components:
 *   schemas:
 *     Inscripcion:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           description: El id auto generado de la inscripcion
 *         id_alumno:
 *           type: string
 *           description: El id auto generado del alumno
 *         id_materia:
 *           type: string
 *           description: El id de la materia a la cual pertenece
 *       example:
 *         id: 1000
 *         id_alumno: 1
 *         id_materia: 2
 */

/**
  * @swagger
  * tags:
  *   name: Inscripciones
  *   description: Manejo Inscripciones API
  */

/**
 * @swagger
 * /ins:
 *   get:
 *     tags: [Inscripciones]
 *     summary: Retorna la lista de todas las inscripciones
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
 *         description: Lista de Inscripciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inscripcion'                 
 */

router.get("/", inscripcionesControllers.getInscripciones);

/**
 * @swagger
 * /ins:
 *   post:
 *     summary: Crear nueva inscripción
 *     tags: [Inscripciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inscripcion'
 *     responses:
 *       200:
 *         description: La inscripción fue creada sin problemas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inscripcion'
 *       500:
 *         description: Algún error del servidor
 */

router.post('/', inscripcionesControllers.createInscripcion);

/**
 * @swagger
 * /ins/{id}:
 *   get:
 *     summary: Retorna inscripción según id
 *     tags: [Inscripciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id de la inscripcion
 *     responses:
 *       200:
 *         description: La descripción de la inscripcion por id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inscripcion'
 *       404:
 *         description: La inscripción no fue encontrada
 */

router.get('/:id', inscripcionesControllers.getInscripcion);

/**
 * @swagger
 * /ins/{id}:
 *  put:
 *    summary: Actualizar inscripción por id
 *    tags: [Inscripciones]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id de la Inscripciones
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Inscripcion'
 *    responses:
 *      200:
 *        description: La inscripción fue actualizada
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Inscripcion'
 *      404:
 *        description: La inscripción no fue encontrada
 *      500:
 *        description: Some error happened
 */

router.put('/:id', inscripcionesControllers.putInscripcion);

/**
 * @swagger
 * /ins/{id}:
 *   delete:
 *     summary: Borra la inscripción según id
 *     tags: [Inscripciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id de la inscripción
 * 
 *     responses:
 *       200:
 *         description: La inscripción fue borrada
 *       404:
 *         description: La inscripción no fue encontrada
 */


router.delete('/:id', inscripcionesControllers.deleteInscripcion);

module.exports = router;