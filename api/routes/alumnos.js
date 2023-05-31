const express = require('express');
const router = express.Router();
const models = require('../models');

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

router.get('/', (req, res) => {
    console.log('Esto es un mensaje para ver en consola');
    /*
    var limit = 100;
    var page = 1;
        limit = parseInt(req.query.limit);
        page = parseInt(req.query.page);
     */
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    models.alumno
        .findAll({
        attributes: ['id', 'nombre', 'apellido'],
        offset:((page-1)*limit),
        limit : limit,
        subQuery:false
    })
    .then((alumnos) => res.send(alumnos))
    .catch(() => res.sendStatus(500));
});

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

router.post('/', (req, res) => {
    models.alumno
        .create({ nombre: req.body.nombre, apellido: req.body.apellido})
        .then((alumno) => res.status(201).send({ id: alumno.id }))
        .catch((error) => {
        if (error === 'SequelizeUniqueConstraintError: Validation error') {
            res
            .status(400)
            .send('Bad request: existe otro alumno con el mismo nombre');
        } else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
        }
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
    models.alumno
        .findOne({
        attributes: ['id', 'nombre', 'apellido'],
        where: { id },
    })
    .then((alumno) => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};


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

router.get('/:id', (req, res) => {
    findAlumno(req.params.id, {
        onSuccess: (alumno) => res.send(alumno),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
});


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

router.put('/:id', (req, res) => {
    const {nombre, apellido} = req.body ;
    const update = {} ;
    if(nombre) update.nombre = nombre ;
    if(apellido) update.apellido = apellido ;
    const onSuccess = (alumno) =>
        alumno
        .update(update)
        .then(() => res.sendStatus(200))
        .catch((error) => {
            if (error === 'SequelizeUniqueConstraintError: Validation error') {
            res
                .status(400)
                .send('Bad request: existe otro alumno con el mismo nombre y/o apellido');
            } else {
            console.log(
                `Error al intentar actualizar la base de datos: ${error}`,
            );
            res.sendStatus(500);
        }
    });
    findAlumno(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
});

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

router.delete('/:id', (req, res) => {
    const onSuccess = (alumno) =>
        alumno
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findAlumno(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
});

module.exports = router;