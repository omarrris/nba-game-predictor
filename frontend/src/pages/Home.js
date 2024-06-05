import React, { useEffect, useState } from 'react';
import { getTeams } from '../services/api';

const Home = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const data = await getTeams();
      setTeams(data.data);
    };

    fetchTeams();
  }, []);

  return (
    <div>
      <h1>Team Performance Analyzer</h1>
      <p>Select a team and season to analyze their performance.</p>
      <ul>
        {teams.map(team => (
          <li key={team.id}>{team.full_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
