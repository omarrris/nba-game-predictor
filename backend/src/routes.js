const express = require('express');
const { getTeams, getTeamStats, getPlayerStats, getPlayers } = require('./controllers');

const router = express.Router();

router.get('/teams', getTeams);
router.get('/team/:id/stats', getTeamStats);
router.get('/player/:id/stats', getPlayerStats);
router.get('/players', getPlayers);

module.exports = router;
