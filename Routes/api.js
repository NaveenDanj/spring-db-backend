const express = require('express');
const router = express.Router();
const AuthRequired = require('../Middlewares/AuthRequired');

const authController = require('../Controllers/Auth/auth.controller');
const appController = require( '../Controllers/app.controller');

router.get('/', (req, res) => {
    res.json('SpringDB API');
});

// add middleware to jobController
// router.use('/job' , AuthRequired('User') ,  JobController);

router.use('/auth' , authController);
router.use('/app' , AuthRequired('user') , appController);

module.exports = router;