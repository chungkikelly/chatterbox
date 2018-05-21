const express = require("express");

const router = express.Router();

// Fetch information about a specific user
router.get('/users/:id');

// Create a new user
router.post('/users');

// Search database for all users that match the information provided
router.get('/users/search');

module.exports = router;

// TODO: add controller functions after SQL queries are complete
