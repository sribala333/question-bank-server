const express = require('express');
const schemaController = require('../controllers/schemaController');

const router = express.Router();
 
router.post('/create', schemaController.createTables);

module.exports = router;
