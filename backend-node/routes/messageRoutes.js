const express = require("express");

const router = express.Router();

// Fetch all messages from a specific channel
router.get('/channels/:id/messages');

// Create a new message
router.post('/messages');

// Edit an existing message
router.patch('/messages/:id');

// Edit an existing message
router.delete('/messages/:id');

module.exports = router;

// TODO: add controller functions after SQL queries are complete
