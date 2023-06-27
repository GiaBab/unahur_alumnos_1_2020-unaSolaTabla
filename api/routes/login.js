const express = require('express');
const models = require('../models');
const router = express.Router();
var bcrypt = require('bcryptjs'); 

const compare = (token, userToken) => {
    return token === userToken
};


router.get('/', async (req, res) => {
    try {
      const { email, token } = req.body;
      const user = await models.user.findOne({
        attributes: ['id', 'email', 'password', 'id_alumno', 'token'],
        where: { email }
      });
  
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }
  
      console.log('token:', token);
      console.log('user.token:', user.token);
      const checkToken = await compare(token, user.token);

  
      if (checkToken) {
        return res.send({
          data: user,
        });
      } else {
        return res.status(409).send('Usuario y/o Token inválido');
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Error en el servidor' });
    }
  });
  
module.exports = router;