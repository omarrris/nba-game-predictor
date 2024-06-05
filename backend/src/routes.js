const express = require('express');
const { getTeams, getTeamStats, getPlayerStats } = require('./controllers');

const router = express.Router();

router.get('/teams', getTeams);
router.get('/team/:id/stats', getTeamStats);
router.get('/player/:id/stats', getPlayerStats);

module.exports = router;
