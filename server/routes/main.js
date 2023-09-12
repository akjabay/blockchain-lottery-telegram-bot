const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/main.js')
const { check } = require('express-validator');


router.get('/', authControllers.getIndex);

module.exports = router;
