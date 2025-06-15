const express = require('express');
const router = express.Router();
const { getPollHistory } = require('../controllers/pollController');

router.get('/history/:teacherId', getPollHistory);

module.exports = router;