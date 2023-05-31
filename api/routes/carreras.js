const express = require('express');
const router = express.Router();
const models = require('../models');

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

router.get('/', (req, res) => {
  console.log('Esto es un mensaje para ver en consola');
  const limit = parseInt(req.query.limit) ;
  const page = parseInt(req.query.page) ;
  models.carrera
    .findAll({
      attributes: ['id', 'nombre'],
      offset:((page-1)*limit),
      limit : limit,
      subQuery:false
    })
    .then((carreras) => res.send(carreras))
    .catch(() => res.sendStatus(500));
});

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


router.post('/', (req, res) => {
  models.carrera
    .create({ nombre: req.body.nombre })
    .then((carrera) => res.status(201).send({ id: carrera.id }))
    .catch((error) => {
      if (error === 'SequelizeUniqueConstraintError: Validation error') {
        res
          .status(400)
          .send('Bad request: existe otra carrera con el mismo nombre');
      } else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`);
        res.sendStatus(500);
      }
    });
});

const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
  models.carrera
    .findOne({
      attributes: ['id', 'nombre'],
      where: { id },
    })
    .then((carrera) => (carrera ? onSuccess(carrera) : onNotFound()))
    .catch(() => onError());
};

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

router.get('/:id', (req, res) => {
  findCarrera(req.params.id, {
    onSuccess: (carrera) => res.send(carrera),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});


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

router.put('/:id', (req, res) => {
  const onSuccess = (carrera) =>
    carrera
      .update({ nombre: req.body.nombre }, { fields: ['nombre'] })
      .then(() => res.sendStatus(200))
      .catch((error) => {
        if (error === 'SequelizeUniqueConstraintError: Validation error') {
          res
            .status(400)
            .send('Bad request: existe otra carrera con el mismo nombre');
        } else {
          console.log(
            `Error al intentar actualizar la base de datos: ${error}`,
          );
          res.sendStatus(500);
        }
      });
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

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

router.delete('/:id', (req, res) => {
  const onSuccess = (carrera) =>
    carrera
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;