const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', sessionController.getAllSessions);
router.get('/:id', sessionController.getSessionById);
router.put('/:id/progress', sessionController.updateSessionProgress);
router.delete('/:id', sessionController.deleteSession);

module.exports = router;
