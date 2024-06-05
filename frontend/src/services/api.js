import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getTeams = async () => {
  const response = await api.get('/teams');
  return response.data;
};

export const getTeamStats = async (teamId, season) => {
  const response = await api.get(`/team/${teamId}/stats`, {
    params: { season },
  });
  return response.data;
};

export const getPlayerStats = async (playerId) => {
  const response = await api.get(`/player/${playerId}/stats`);
  return response.data;
};

export const getPlayers = async (teamId) => {
  const response = await api.get(`/players`, {
    params: { team_id: teamId },
  });
  return response.data;
};
