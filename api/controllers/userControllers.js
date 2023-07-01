const models = require('../models');
const bcrypt = require('bcryptjs'); 

const getUsers = (req, res) => {
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
};

const createUsers = (req, res) => {
    const {email, password, id_alumno} = req.body ;

    var passHash = bcrypt.hashSync(password, 8); 
        // Creación del usuario
    models.user.create({ email: email, password: passHash, id_alumno: id_alumno })
    .then((user) =>  res.status(201).send({ id: user.id }))
    .catch( (error) => {
        if (error === 'SequelizeUniqueConstraintError: Validation error') {
            res.status(400).send('Bad request: existe otro User con el mismo email');
        } else {
            console.log(`Error al intentar insertar en la base de datos: ${error}`);
            res.sendStatus(500);
        }
    })
};

const findUser = (id, { onSuccess, onNotFound, onError }) => {
    models.user
        .findOne({
        attributes: ['id', 'email', 'password', 'id_alumno'],
        where: { id },
    })
    .then((user) => (user ? onSuccess(user) : onNotFound()))
    .catch(() => onError());
};

const getUser = (req, res) => {
    findUser(req.params.id, {
        onSuccess: (user) => res.send(user),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
};

const putUser = (req, res) => {
    const {email, password, id_alumno} = req.body ;
    const update = {} ;
    if(email) update.email = email ;
    if(password) update.password = bcrypt.hashSync(password, 8) ;
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
} ;

const deleteUser = (req, res) => {
    const onSuccess = (user) =>
        user
        .destroy()
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(500));
    findUser(req.params.id, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500),
    });
} ;

module.exports = {getUser, getUsers, createUsers, putUser, deleteUser, findUser}