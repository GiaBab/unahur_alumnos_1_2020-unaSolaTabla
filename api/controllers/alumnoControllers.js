const models = require('../models');

const getAlumnos = (req, res) => {
    console.log('obtener alumno');
    
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
};

const createAlumno = (req, res) => {
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
    })
};

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
    models.alumno
        .findOne({
        attributes: ['id', 'nombre', 'apellido'],
        where: { id },
    })
    .then((alumno) => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

const getAlumno = (req, res) => {
    findAlumno(req.params.id, {
        onSuccess: (alumno) => res.send(alumno),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
};

const putAlumno = (req, res) => {
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
};

const deleteAlumno = (req, res) => {
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
};

module.exports = { getAlumno, getAlumnos, putAlumno, createAlumno, deleteAlumno } ;