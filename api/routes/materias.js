const express = require('express');
const router = express.Router();
const models = require('../models');

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


router.get("/", (req, res,next) => {

  const limit = parseInt(req.query.limit) ;
  const page = parseInt(req.query.page) ;
  models.materia.findAll({attributes: ["id","nombre","id_carrera"],
      /////////se agrega la asociacion 
      include:[{as:'Carrera-Relacionada', model:models.carrera, attributes: ["id","nombre"]}],
      offset:((page-1)*limit),
      limit : limit,
      subQuery:false
      ////////////////////////////////

    }).then(materias => res.send(materias)).catch(error => { return next(error)});
});

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


router.post("/", (req, res) => {
  models.materia
    .create({ nombre: req.body.nombre, id_carrera: req.body.id_carrera })
    .then(materia => res.status(201).send({ id: materia.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra materia con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

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

router.get("/:id", (req, res) => {
  findmateria(req.params.id, {
    onSuccess: materia => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});


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

router.put("/:id", (req, res) => {
  const {nombre, id_carrera} = req.body ;
  const update = {} ;
  if(nombre) update.nombre = nombre ;
  if(id_carrera) update.id_carrera = id_carrera ; 
  const onSuccess = materia =>
    materia
      .update(update)
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra materia con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findmateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

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


router.delete("/:id", (req, res) => {
  const onSuccess = materia =>
    materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findmateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
