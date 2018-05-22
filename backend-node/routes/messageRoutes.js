const express = require("express");
const messagesController = require('../controllers/messagesController');

const router = express.Router();

// Fetch all messages from a specific channel
router.get('/channels/:channel_id/messages', messagesController.fetchMessages);

// Create a new message
router.post('/messages', messagesController.createMessage);

// Edit an existing message
// router.patch('/messages/:id');

// Edit an existing message
// router.delete('/messages/:id');

module.exports = router;

// TODO: Add edit and delete when time permits
