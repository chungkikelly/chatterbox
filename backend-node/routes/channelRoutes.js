const express = require("express");
const channelsController = require('../controllers/channelsController');

const router = express.Router();

// Search database for all channels that match the information provided
router.get('/channels/search', channelsController.searchChannel);

// Fetch information about a specific channel
router.get('/channels/:id', channelsController.fetchChannel);

// Create a new channel
router.post('/channels', channelsController.createChannel);

module.exports = router;

// TODO: Add edit and delete when time permits
// TODO: We're gonna omit channels for the sake of time, go back and add
