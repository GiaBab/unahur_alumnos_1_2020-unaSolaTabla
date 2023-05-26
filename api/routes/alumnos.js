const express = require('express');
const router = express.Router();
const models = require('../models');
const logger = require('../loggers');

router.get('/', (req, res,next) => {
    console.log('Esto es un mensaje para ver en consola');
    const limit = parseInt(req.query.limit) ;
    const page = parseInt(req.query.page) ;
    models.alumno
        .findAll({
        attributes: ['id', 'nombre', 'apellido'],
        offset:((page-1)*limit),
        limit : limit,
        subQuery:false
    })
    .then((alumnos) => res.send(alumnos)).catch(error => {logger.error(error); return next(error)});
});

router.post('/', (req, res) => {
    models.alumno
        .create({ nombre: req.body.nombre, apellido: req.body.apellido})
        .then((alumno) => res.status(201).send({ id: alumno.id }))
        .catch((error) => {
        if (error === 'SequelizeUniqueConstraintError: Validation error') {
            res.status(400).send('Bad request: existe otro alumno con el mismo nombre');
        } else {
            logger.error(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
        }
        logger.error(error);
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
    models.alumno
        .findOne({
        attributes: ['id', 'nombre', 'apellido'],
        where: { id },
    })
    .then((alumno) => (alumno ? onSuccess(alumno) : onNotFound(), logger.error("don't found")))
    .catch(() => onError(), logger.error(onError));
};

router.get('/:id', (req, res) => {
    findAlumno(req.params.id, {
        onSuccess: (alumno) => res.send(alumno),
        onNotFound: () => {res.sendStatus(404), logger.error("don't found")},
        onError: () => res.sendStatus(500),
    });
});


router.put('/:id', (req, res) => {
    const {nombre, apellido} = req.body ;
    const update = {} ;
    if(nombre) update.nombre = nombre ;
    if(apellido) update.apellido = apellido ;
    const onSuccess = (alumno) =>
         alumno
        .update(update)
        .then(() => res.sendStatus(200), logger.info('alumno modificado'))
        .catch((error) => {
            if (error === 'SequelizeUniqueConstraintError: Validation error') {
                logger.error('Bad request: existe otro alumno con el mismo nombre y/o apellido')
                res.status(400).send('Bad request: existe otro alumno con el mismo nombre y/o apellido');
            } else {
            logger.error(`Error al intentar actualizar la base de datos: ${error}`,);
            res.sendStatus(500);
            }
    });
    findAlumno(req.params.id, {
        onSuccess,
        onNotFound: () => {res.sendStatus(404), logger.error("don't found")},
        onError: () => res.sendStatus(500),
    });
});

router.delete('/:id', (req, res) => {
    const onSuccess = (alumno) =>
        alumno
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findAlumno(req.params.id, {
        onSuccess,
        onNotFound: () => {res.sendStatus(404), logger.error("don't found")},
        onError: () => res.sendStatus(500),
    });
});

module.exports = router;