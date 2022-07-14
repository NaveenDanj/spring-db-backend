const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json('ILM API');
});
// add middleware to jobController
// router.use('/job' , AuthRequired('User') ,  JobController);


module.exports = router;