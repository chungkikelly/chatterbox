const express = require("express");

const router = express.Router();

// Fetch information about a specific channel
router.get('/channels/:id');

// Create a new channel
router.post('/channels');

// Search database for all channels that match the information provided
router.get('/channels/search');

module.exports = router;

// TODO: add controller functions after SQL queries are complete
