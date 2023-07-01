const models = require('../models');

const getMaterias = (req, res,next) => {

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
};

const createMateria = (req, res) => {
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
};

const findmateria = (id, { onSuccess, onNotFound, onError }) => {
    models.materia
      .findOne({
        attributes: ["id", "nombre"],
        where: { id }
      })
      .then(materia => (materia ? onSuccess(materia) : onNotFound()))
      .catch(() => onError());
};

const getMateria = (req, res) => {
    findmateria(req.params.id, {
      onSuccess: materia => res.send(materia),
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
};

const putMateria = (req, res) => {
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
};

const deleteMateria = (req, res) => {
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
}

module.exports = {getMateria, getMaterias, createMateria, putMateria, deleteMateria}