const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json('SpringDB API');
});
// add middleware to jobController
// router.use('/job' , AuthRequired('User') ,  JobController);
router.use('/auth');

module.exports = router;