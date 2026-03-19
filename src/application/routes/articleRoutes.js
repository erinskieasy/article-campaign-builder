const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/articleController');

router.get('/types', ctrl.getTypes);
router.post('/generate', ctrl.generateOne);
router.post('/generate-all', ctrl.generateAll);

module.exports = router;
