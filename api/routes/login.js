const express = require('express');
const models = require('../models');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const jwt = require("jsonwebtoken");

router.get('/', (req, res) => {
  
  const loginOn = (user, password) => {
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, 'secreto_del_token');
      res.send({user, message: 'Usuario logeado', token});
    } else {
      // Unauthorized Access
      res.status(401).send('Contraseña incorrecta');
    }
  }

  let {email, password} = req.body;
  models.user.findOne({
    attributes: ['id', 'email', 'password', 'id_alumno'],
    where: {email}
  }).then(user => {
    if (!user) {
      res.status(404).send('Usuario con este correo no encontrado');
    } else {
      loginOn(user, password);
    }}).catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
});
  
module.exports = router;