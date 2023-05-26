const express = require('express');
const router = express.Router();
const models = require('../models');
const logger = require('../loggers');

router.get("/", (req, res,next) => {
    const limit = parseInt(req.query.limit) ;
    const page = parseInt(req.query.page) ;
    models.inscripcion.findAll({
        attributes: ["id","id_alumno", "id_materia"],     
      /////////se agrega la asociacion 
        include:[{as:'Inscripcion-Alumno-Relacion', model:models.alumno, attributes: ["id","nombre"]},
        {as:'Inscripcion-Materia-Relacion', model:models.materia, attributes: ["id","nombre"]}], 
      ////////////////////////////////
        offset:((page-1)*limit),
        limit : limit,
        subQuery:false
    }).then(inscripciones => res.send(inscripciones)).catch(error => {logger.error(error); return next(error)});
});

router.post('/', (req, res) => {
    models.inscripcion
        .create({ id_alumno: req.body.id_alumno, id_materia: req.body.id_materia })
        .then((inscripcion) => res.status(201).send({ id: inscripcion.id }))
        .catch((error) => {
        if (error === 'SequelizeUniqueConstraintError: Validation error') {
            res.status(400).send('Bad request: existe otra inscripcion con el mismo nombre');
        } else {
            logger.error(`Error al intentar insertar en la base de datos: ${error}`);
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
    .then((inscripcion) => (inscripcion ? onSuccess(inscripcion) : onNotFound(), logger.error("don't found")))
    .catch(() => onError());
};

router.get('/:id', (req, res) => {
    findInscripcion(req.params.id, {
    onSuccess: (inscripcion) => res.send(inscripcion),
    onNotFound: () => {res.sendStatus(404), logger.error("don't found")},
    onError: () => res.sendStatus(500),
    });
});

router.put('/:id', (req, res) => {
    const {id_alumno, id_materia} = req.body;
    const update = {} ;
    if(id_alumno) update.id_alumno = id_alumno ;
    if(id_materia) update.id_materia = id_materia ;
    const onSuccess = (inscripcion) =>
    inscripcion
        .update(update)
        .then(() => res.sendStatus(200), logger.info('inscripcion modificado'))
        .catch((error) => {
            if (error === 'SequelizeUniqueConstraintError: Validation error') {
            res.status(400).send('Bad request: existe otra inscripcion con el mismo Alumno y Materia');
            logger.error('Bad request: existe otra inscripcion con el mismo alumno y Materia');
        } else {
            logger.error(`Error al intentar actualizar la base de datos: ${error}`,);
            res.sendStatus(500);
        }
    });
    findInscripcion(req.params.id, {
        onSuccess,
        onNotFound: () => {res.sendStatus(404), logger.error("don't found")},
        onError: () => res.sendStatus(500),
    });
});

router.delete('/:id', (req, res) => {
    const onSuccess = (inscripcion) =>
    inscripcion
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findInscripcion(req.params.id, {
        onSuccess,
        onNotFound: () => {res.sendStatus(404), logger.error("don't found")},
        onError: () => res.sendStatus(500),
    });
});

module.exports = router;