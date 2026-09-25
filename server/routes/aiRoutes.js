const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuthMiddleware } = require('../middleware/auth');

router.post('/generate', optionalAuthMiddleware, aiController.generateStructuredData);

module.exports = router;
