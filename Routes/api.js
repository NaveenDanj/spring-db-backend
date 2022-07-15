const express = require('express');
const router = express.Router();
const authController = require('../Controllers/Auth/auth.controller');

router.get('/', (req, res) => {
    res.json('SpringDB API');
});

// add middleware to jobController
// router.use('/job' , AuthRequired('User') ,  JobController);

router.use('/auth/register' , authController);

module.exports = router;