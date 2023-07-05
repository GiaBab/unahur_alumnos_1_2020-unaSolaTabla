const createAlumnoTest = (req, res) => {
    const { nombre, apellido } = req.body;
    const nuevoAlumno = { nombre: nombre, apellido: apellido };

  // Simulación de la búsqueda del alumno en la base de datos
  const alumnoExistente = { nombre: 'Manolo' }; // Simulamos que hay un alumno existente con el mismo nombre

  if (alumnoExistente && alumnoExistente.nombre === nombre && alumnoExistente.apellido === apellido) {
    // El alumno ya existe
    res.status(400).send('Bad request: existe otro Alumno con el mismo Nombre y Apellido');
  } else {
    // Envía una respuesta de éxito con los datos del nuevo alumno
    res.status(201).send({ nombre: nuevoAlumno.nombre, apellido: nuevoAlumno.apellido });
  }
};


const putAlumnoTest = (req, res) => {
    const {nombre, apellido} = req.body ;
    const update = {} ;
    if(nombre) update.nombre = nombre ;
    if(apellido) update.apellido = apellido ;
    const onSuccess = () => {
        // Simulación de éxito al actualizar el alumno
        res.sendStatus(200).send(update);
    };

    const onNotFound = () => {
        // Simulación de alumno no encontrado
        res.sendStatus(404);
    };

    const onError = () => {
        // Simulación de error en la operación
        res.sendStatus(500);
    };
};


module.exports = { putAlumnoTest, createAlumnoTest } ;