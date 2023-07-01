const express = require('express');
const router = express.Router();
const alumnoControllers = require('../controllers/alumnoControllers');

/**
 * @swagger
 * components:
 *   schemas:
 *     Alumno:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *       properties:
 *         id:
 *           type: string
 *           description: El id auto generado del alumno
 *         nombre:
 *           type: string
 *           description: El nombre del alumno
 *         apellido:
 *           type: string
 *           description: El apellido del alumno
 *       example:
 *         id: 1000
 *         nombre: Juan
 *         apellido: Perez
 */

/**
  * @swagger
  * tags:
  *   name: Alumnos
  *   description: Manejo Alumnos API
  */

/**
 * @swagger
 * /alum:
 *   get:
 *     tags: [Alumnos]
 *     summary: Retorna la lista de todos los alumnos
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
 *         description: Lista de alumnos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alumno'
 *                  
 */

router.get('/', alumnoControllers.getAlumnos);

/**
 * @swagger
 * /alum:
 *   post:
 *     summary: Crear nuevo alumno
 *     tags: [Alumnos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Alumno'
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

router.post('/', alumnoControllers.createAlumno);

/**
 * @swagger
 * /alum/{id}:
 *   get:
 *     summary: Retorna alumno según id
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id del alumno
 *     responses:
 *       200:
 *         description: La descripción del alumno por id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Alumno'
 *       404:
 *         description: El alumno no fue encontrado
 */

router.get('/:id', alumnoControllers.getAlumno);


/**
 * @swagger
 * /alum/{id}:
 *  put:
 *    summary: Actualizar alumno por id
 *    tags: [Alumnos]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del alumno
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Alumno'
 *    responses:
 *      200:
 *        description: El alumno fue actualizado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Alumno'
 *      404:
 *        description: El alumno no fue encontrado
 *      500:
 *        description: Some error happened
 */

router.put('/:id', alumnoControllers.putAlumno);

/**
 * @swagger
 * /alum/{id}:
 *   delete:
 *     summary: Borra el alumno según id
 *     tags: [Alumnos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: La id del Alumno
 * 
 *     responses:
 *       200:
 *         description: El Alumno fue borrado
 *       404:
 *         description: El Alumno no fue encontrado
 */

router.delete('/:id', alumnoControllers.deleteAlumno);

module.exports = router;