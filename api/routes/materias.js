const express = require('express');
const materiaControllers = require('../controllers/materiaControllers');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Materia:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: string
 *           description: El id auto generado de la materia
 *         nombre:
 *           type: string
 *           description: El nombre de la materia
 *         id_carrera:
 *           type: string
 *           description: El id de la carrera a la cual pertenece
 *       example:
 *         id: 1000
 *         nombre: Matemática
 *         id_carrera: 1
 */

/**
  * @swagger
  * tags:
  *   name: Materias
  *   description: Manejo Materias API
  */

/**
 * @swagger
 * /mat:
 *   get:
 *     tags: [Materias]
 *     summary: Retorna la lista de todas las materias
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
 *         description: Lista de materias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Materia'                 
 */


router.get("/", materiaControllers.getMaterias);

/**
 * @swagger
 * /mat:
 *   post:
 *     summary: Crear nueva materia
 *     tags: [Materias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Materia'
 *     responses:
 *       200:
 *         description: La Materia fue creada sin problemas.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Materia'
 *       500:
 *         description: Algún error del servidor
 */


router.post("/", materiaControllers.createMateria);

const findmateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(materia => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

/**
 * @swagger
 * /mat/{id}:
 *   get:
 *     summary: Retorna materia según id
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id de la materia
 *     responses:
 *       200:
 *         description: La descripción de la materia por id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Materia'
 *       404:
 *         description: La materia no fue encontrado
 */

router.get("/:id", materiaControllers.getMateria);


/**
 * @swagger
 * /mat/{id}:
 *  put:
 *    summary: Actualizar materia por id
 *    tags: [Materias]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id de la materia
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Materia'
 *    responses:
 *      200:
 *        description: La materia fue actualizado
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Materia'
 *      404:
 *        description: La materia no fue encontrada
 *      500:
 *        description: Some error happened
 */

router.put("/:id", materiaControllers.putMateria);

/**
 * @swagger
 * /mat/{id}:
 *   delete:
 *     summary: Borra la materia según id
 *     tags: [Materias]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id de la Materia
 * 
 *     responses:
 *       200:
 *         description: La Materia fue borrada
 *       404:
 *         description: La Materia no fue encontrada
 */


router.delete("/:id", materiaControllers.deleteMateria);

module.exports = router;
