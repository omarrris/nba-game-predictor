const axios = require('axios');

const getTeams = async (req, res) => {
  try {
    const response = await axios.get('https://www.balldontlie.io/api/v1/teams');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

const getTeamStats = async (req, res) => {
  const { id } = req.params;
  const { season } = req.query;
  try {
    const response = await axios.get(`https://www.balldontlie.io/api/v1/stats?team_ids[]=${id}&season=${season}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team stats' });
  }
};

const getPlayerStats = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://www.balldontlie.io/api/v1/players/${id}/stats`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
};

const getPlayers = async (req, res) => {
  const { team_id } = req.query;
  try {
    const response = await axios.get(`https://www.balldontlie.io/api/v1/players?team_ids[]=${team_id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
};

module.exports = { getTeams, getTeamStats, getPlayerStats, getPlayers };
