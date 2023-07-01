const express = require('express');
const router = express.Router();
const loginControllers = require('../controllers/loginControllers');

router.get('/', loginControllers.getLogin);

module.exports = router;