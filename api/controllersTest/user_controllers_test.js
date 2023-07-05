const bcrypt = require('bcryptjs'); 

const createUsersTest = (req, res) => {
  const { email, password, id_alumno } = req.body;
  const passHash = bcrypt.hashSync(password, 8);
  const newUser = { email: email, password: passHash, id_alumno: id_alumno };

  // Simulación de la búsqueda del usuario en la base de datos
  const usuarioExistente = { email: 'usuarioexistente@example.com' }; // Simulamos que hay un usuario existente con el mismo email

  if (usuarioExistente && usuarioExistente.email === email) {
    // El usuario ya existe
    res.status(400).send('Bad request: existe otro User con el mismo email');
  } else {
    // Envía una respuesta de éxito con los datos del nuevo usuario
    res.status(201).send({ email: newUser.email, password: newUser.password, id_alumno: newUser.id_alumno });
  }
};


const putUserTest = (req, res) => {
  const { email, password, id_alumno } = req.body;
  const update = {};
  if (email) update.email = email;
  if (password) update.password = bcrypt.hashSync(password, 8);
  if (id_alumno) update.id_alumno = id_alumno;

  const onSuccess = () => {
    // Simulación de éxito al actualizar el usuario
    res.sendStatus(200).send(update);
  };

  const onNotFound = () => {
    // Simulación de usuario no encontrado
    res.sendStatus(404);
  };

  const onError = () => {
    // Simulación de error en la operación
    res.sendStatus(500);
  };

  
};

module.exports = { createUsersTest, putUserTest  };