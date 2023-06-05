const express = require('express');
const router = express.Router();
const models = require('../models');

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

router.get('/', (req, res) => {
    console.log('Esto es un mensaje para ver en consola');
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    models.user.findAll({
        attributes: ['id', 'email', 'password', 'id_alumno'],
        include:[{as:'user-alumno', model:models.alumno, attributes: ["id","nombre","apellido"]}],
        offset:((page-1)*limit),
        limit : limit,
        subQuery:false
    })
    .then((users) => res.send(users))
    .catch(() => res.sendStatus(500));
});

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

router.post('/', (req, res) => {
    models.user
        .create({ email: req.body.email, password: req.body.password, id_alumno: req.body.id_alumno})
        .then((user) => res.status(201).send({ id: user.id }))
        .catch((error) => {
        if (error === 'SequelizeUniqueConstraintError: Validation error') {
            res
            .status(400)
            .send('Bad request: existe otro User con el mismo email');
        } else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
        }
    });
});

const findUser = (id, { onSuccess, onNotFound, onError }) => {
    models.user
        .findOne({
        attributes: ['id', 'email', 'password', 'id_alumno'],
        where: { id },
    })
    .then((user) => (user ? onSuccess(user) : onNotFound()))
    .catch(() => onError());
};


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

router.get('/:id', (req, res) => {
    findUser(req.params.id, {
        onSuccess: (user) => res.send(user),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
});


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

router.put('/:id', (req, res) => {
    const {email, password, id_alumno} = req.body ;
    const update = {} ;
    if(email) update.email = email ;
    if(password) update.password = password ;
    if(id_alumno) update.id_alumno = id_alumno ;
    const onSuccess = (user) =>
        user
        .update(update)
        .then(() => res.sendStatus(200))
        .catch((error) => {
            if (error === 'SequelizeUniqueConstraintError: Validation error') {
            res
                .status(400)
                .send('Bad request: existe otro User con el mismo email y/o password');
            } else {
            console.log(
                `Error al intentar actualizar la base de datos: ${error}`,
            );
            res.sendStatus(500);
        }
    });
    findUser(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
});

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

router.delete('/:id', (req, res) => {
    const onSuccess = (user) =>
        User
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findUser(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
});

module.exports = router;