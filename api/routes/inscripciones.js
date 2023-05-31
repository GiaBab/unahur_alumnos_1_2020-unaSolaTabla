const express = require('express');
const router = express.Router();
const models = require('../models');

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

router.get("/", (req, res,next) => {
    const limit = parseInt(req.query.limit) ;
    const page = parseInt(req.query.page) ;
    models.inscripcion.findAll({
        attributes: ["id","id_alumno", "id_materia"],     
      /////////se agrega la asociacion 
        include:[{as:'Inscripcion-Alumno-Relacion', model:models.alumno, attributes: ["id","nombre", "apellido"]},
        {as:'Inscripcion-Materia-Relacion', model:models.materia, attributes: ["id","nombre"]}], 
      ////////////////////////////////
        offset:((page-1)*limit),
        limit : limit,
        subQuery:false
    }).then(inscripciones => res.send(inscripciones)).catch(error => { return next(error)});
});

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

router.post('/', (req, res) => {
    models.inscripcion
        .create({ id_alumno: req.body.id_alumno, id_materia: req.body.id_materia })
        .then((inscripcion) => res.status(201).send({ id: inscripcion.id }))
        .catch((error) => {
        if (error === 'SequelizeUniqueConstraintError: Validation error') {
            res
            .status(400)
            .send('Bad request: existe otra inscripcion con el mismo nombre');
        } else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
        }
    });
});

const findInscripcion = (id, { onSuccess, onNotFound, onError }) => {
    models.inscripcion
    .findOne({
        attributes: ['id', 'id_alumno', 'id_materia'],
        where: { id },
    })
    .then((inscripcion) => (inscripcion ? onSuccess(inscripcion) : onNotFound()))
    .catch(() => onError());
};

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

router.get('/:id', (req, res) => {
    findInscripcion(req.params.id, {
    onSuccess: (inscripcion) => res.send(inscripcion),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500),
    });
});

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

router.put('/:id', (req, res) => {
    const {id_alumno, id_materia} = req.body;
    const update = {} ;
    if(id_alumno) update.id_alumno = id_alumno ;
    if(id_materia) update.id_materia = id_materia ;
    const onSuccess = (inscripcion) =>
    inscripcion
        .update(update)
        .then(() => res.sendStatus(200))
        .catch((error) => {
            if (error === 'SequelizeUniqueConstraintError: Validation error') {
            res
            .status(400)
            .send('Bad request: existe otra inscipcion con el mismo Alumno y Materia');
        } else {
            console.log(
            `Error al intentar actualizar la base de datos: ${error}`,
            );
            res.sendStatus(500);
        }
    });
    findInscripcion(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
});

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


router.delete('/:id', (req, res) => {
    const onSuccess = (inscripcion) =>
    inscripcion
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findInscripcion(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
});

module.exports = router;