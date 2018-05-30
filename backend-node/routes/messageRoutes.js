const express = require("express");
const messagesController = require('../controllers/messagesController');

const router = express.Router();

// Fetch all messages from a specific channel
router.get('/messages', messagesController.fetchMessages);

// Edit an existing message
// router.patch('/messages/:id');

// Edit an existing message
// router.delete('/messages/:id');

module.exports = router;
