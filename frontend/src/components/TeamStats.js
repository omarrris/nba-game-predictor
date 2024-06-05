import React, { useEffect, useState } from 'react';
import { getTeamStats } from '../services/api';
import * as d3 from 'd3';

const TeamStats = ({ teamId, season }) => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getTeamStats(teamId, season);
      setStats(data.data);
    };

    fetchStats();
  }, [teamId, season]);

  useEffect(() => {
    if (stats.length > 0) {
      // Visualization code here
      const svg = d3.select('svg');
      // Clear previous content
      svg.selectAll('*').remove();

      // Example: Creating a bar chart
      const margin = { top: 20, right: 30, bottom: 40, left: 40 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .domain(stats.map(d => d.date))
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(stats, d => d.pts)])
        .nice()
        .range([height, 0]);

      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %d')));

      g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y));

      g.selectAll('.bar')
        .data(stats)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.date))
        .attr('y', d => y(d.pts))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.pts))
        .attr('fill', 'steelblue');
    }
  }, [stats]);

  return (
    <div>
      <h2>Team Stats</h2>
      <svg width="600" height="400"></svg>
    </div>
  );
};

export default TeamStats;
