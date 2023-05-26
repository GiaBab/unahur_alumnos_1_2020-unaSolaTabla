const express = require('express');
const router = express.Router();
const models = require('../models');
const logger = require('../loggers');

router.get('/', (req, res, next) => {
  logger.info('Esto es un mensaje para ver en consola');
  const limit = parseInt(req.query.limit) ;
  const page = parseInt(req.query.page) ;
  models.carrera
    .findAll({
      attributes: ['id', 'nombre'],
      offset:((page-1)*limit),
      limit : limit,
      subQuery:false
    })
    .then((carreras) => res.send(carreras)).catch(error => {logger.error(error); return next(error)});
});

router.post('/', (req, res) => {
  models.carrera
    .create({ nombre: req.body.nombre })
    .then((carrera) => res.status(201).send({ id: carrera.id }))
    .catch((error) => {
      if (error === 'SequelizeUniqueConstraintError: Validation error') {
        logger.error('Bad request: existe otra carrera con el mismo nombre');
        res.status(400).send('Bad request: existe otra carrera con el mismo nombre');
      } else {
        logger.error(`Error al intentar insertar en la base de datos: ${error}`);
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
    .then((carrera) => (carrera ? onSuccess(carrera) : onNotFound(), logger.error("don't found")))
    .catch(() => onError());
};

router.get('/:id', (req, res) => {
  findCarrera(req.params.id, {
    onSuccess: (carrera) => res.send(carrera),
    onNotFound: () => {res.sendStatus(404), logger.error("don't found")},
    onError: () => res.sendStatus(500),
  });
});

router.put('/:id', (req, res) => {
  const onSuccess = (carrera) =>
    carrera
      .update({ nombre: req.body.nombre }, { fields: ['nombre'] })
      .then(() => res.sendStatus(200), logger.info('carrera modificada'))
      .catch((error) => {
        if (error === 'SequelizeUniqueConstraintError: Validation error') {
          logger.error('Bad request: existe otra carrera con el mismo nombre');
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre');
        } else {
          logger.error(`Error al intentar actualizar la base de datos: ${error}`);
          res.sendStatus(500);
        }
      });
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => {res.sendStatus(404), logger.error("don't found")},
    onError: () => res.sendStatus(500),
  });
});

router.delete('/:id', (req, res) => {
  const onSuccess = (carrera) =>
    carrera
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => {res.sendStatus(404), logger.error("don't found")},
    onError: () => res.sendStatus(500),
  });
});

module.exports = router;