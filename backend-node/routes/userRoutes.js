const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

// Search database for all users that match the information provided
router.get('/users/search', usersController.searchUser);

// Fetch information about a specific user
router.get('/users/:id', usersController.fetchUser);

// Create a new user
router.post('/users', usersController.createUser);


module.exports = router;

// TODO: add controller functions after SQL queries are complete
