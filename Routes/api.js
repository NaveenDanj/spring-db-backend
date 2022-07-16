const express = require('express');
const router = express.Router();
const AuthRequired = require('../Middlewares/AuthRequired');

const authController = require('../Controllers/Auth/auth.controller');
const appController = require( '../Controllers/app.controller');
const workspaceController = require('../Controllers/workspace.controller');

router.get('/', (req, res) => {
    res.json('SpringDB API');
});

// add middleware to jobController
// router.use('/job' , AuthRequired('User') ,  JobController);

router.use('/auth' , authController);
router.use('/app' , AuthRequired('user') , appController);
router.use('/workspace' , AuthRequired('user') , workspaceController);

module.exports = router;