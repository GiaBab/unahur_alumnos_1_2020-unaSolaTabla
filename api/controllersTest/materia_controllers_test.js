const models = require('../models');

const createMateria = (req, res) => {
    
    const { nombre, id_carrera } = req.body;

    const nuevaMateria = { nombre: req.body.nombre, id_carrera: req.body.id_carrera };

    // Simulación de la búsqueda de la materia en la base de datos
     const materiaExistente = { nombre: 'Matemática' }; // Simulamos que hay una materia existente con el mismo nombre

  if (materiaExistente && materiaExistente.nombre === nombre && materiaExistente.id_carrera === id_carrera) {
    // El usuario ya existe
    res.status(400).send('Bad request: existe otra materia con el mismo nombre');
  } else {
    // Envía una respuesta de éxito con los datos del nuevo usuario
    res.status(201).send({ nombre: nuevaMateria.nombre, id_carrera: nuevaMateria.id_carrera});
  }
};


const putMateria = (req, res) => {
    const {nombre, id_carrera} = req.body ;
    const update = {} ;
    if(nombre) update.nombre = nombre ;
    if(id_carrera) update.id_carrera = id_carrera ; 
    const onSuccess = () => {
        // Simulación de éxito al actualizar la materia
        res.sendStatus(200).send(update);
      };
    
      const onNotFound = () => {
        // Simulación de materia no encontrada
        res.sendStatus(404);
      };
    
      const onError = () => {
        // Simulación de error en la operación
        res.sendStatus(500);
      };
};

module.exports = { createMateria, putMateria}