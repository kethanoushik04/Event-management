const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.createEvent);
router.get('/profile/:profileId', eventController.getEventsByProfile);
router.get('/:eventId/logs', eventController.getEventLogs);
router.put('/:eventId', eventController.updateEvent);

module.exports = router;
