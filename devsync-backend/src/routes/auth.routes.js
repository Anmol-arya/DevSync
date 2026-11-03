const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller'); // Import loginUser

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // Add the new login route

module.exports = router;


