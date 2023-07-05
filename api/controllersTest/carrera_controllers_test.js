const createCarreraTest = (req, res) => {

    const { nombre } = req.body;
    const nuevaCarrera = { nombre: req.body.nombre };

    // Simulación de la búsqueda de la carrera en la base de datos
    const carreraExistente = { nombre: 'CIU' }; // Simulamos que hay una carrera existente con el mismo nombre

    if (carreraExistente && carreraExistente.nombre === nombre) {
        // La carrera ya existe
        res.status(400).send('Bad request: existe otra carrera con el mismo nombre');
    } else {
        // Envía una respuesta de éxito con los datos de la nueva carrera
        res.status(200).send({ nombre: nuevaCarrera.nombre });
    }
};


const putCarreraTest = (req, res) => {
    const { nombre } = req.body;
    const update = {};
    if (nombre) update.nombre = nombre;
  

    const onSuccess = () => {
    // Simulación de éxito al actualizar la carrera
    res.sendStatus(200).send(update);
  };

  const onNotFound = () => {
    // Simulación de la carrera no encontrada
    res.sendStatus(404);
  };

  const onError = () => {
    // Simulación de error en la operación
    res.sendStatus(500);
  };
};


module.exports = {putCarreraTest, createCarreraTest };