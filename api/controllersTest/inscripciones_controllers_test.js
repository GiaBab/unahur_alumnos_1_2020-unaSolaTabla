const models = require('../models');

const createInscripcionTest = (req, res) => {
    
    const { id_alumno, id_materia } = req.body;
    const nuevaInscripcion = { id_alumno: req.body.id_alumno, id_materia: req.body.id_materia };

  // Simulación de la búsqueda de la inscripcion en la base de datos
  const inscripcionExistente = { id_alumno: 1, id_materia: 6 }; // Simulamos que hay una inscripcion existente con el mismo alumno y materia.

  if (inscripcionExistente && inscripcionExistente.id_alumno === id_alumno && inscripcionExistente.id_materia === id_materia) {
    // La inscripcion ya existe
    res.status(400).send('Bad request: existe una inscripcion de ese alumno a esa materia');
  } else {
    // Envía una respuesta de éxito con los datos de la nueva inscripcion.
    res.status(200).send({ id_alumno: nuevaInscripcion.id_alumno, id_materia: nuevaInscripcion.id_materia });
  }


};

const putInscripcionTest = (req, res) => {
    const { id_alumno, id_materia } = req.body;
    const update = {};
    if (id_alumno) update.id_alumno = id_alumno;
    if (id_materia) update.id_materia = id_materia;

  const onSuccess = () => {
    // Simulación de éxito al actualizar la inscripcion.
    res.sendStatus(200).send(update);
  };

  const onNotFound = () => {
    // Simulación de inscripcion no encontrada
    res.sendStatus(404);
  };

  const onError = () => {
    // Simulación de error en la operación
    res.sendStatus(500);
  };
};



module.exports = {createInscripcionTest, putInscripcionTest };