import React, { useEffect, useState } from 'react';
import { getTeamStats, getPlayers, getPlayerStats } from '../services/api';
import VisualizationToggle from './VisualizationToggle';
import * as d3 from 'd3';
import * as THREE from 'three';
import './TeamStats.css';

const TeamStats = ({ teamId, season }) => {
  const [stats, setStats] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [currentVisualization, setCurrentVisualization] = useState('Shot Chart');
  const visualizations = ['Shot Chart', 'Heat Map', 'Radial Chart', 'Shot Trajectories', '3D Court'];

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getTeamStats(teamId, season);
      setStats(data.data);
    };

    const fetchPlayers = async () => {
      const data = await getPlayers(teamId);
      setPlayers(data.data);
    };

    fetchStats();
    fetchPlayers();
  }, [teamId, season]);

  useEffect(() => {
    if (selectedPlayer) {
      const fetchPlayerStats = async () => {
        const data = await getPlayerStats(selectedPlayer.id);
        setStats(data.data);
      };

      fetchPlayerStats();
    }
  }, [selectedPlayer]);

  useEffect(() => {
    if (stats.length > 0) {
      const svg = d3.select('#court');
      svg.selectAll('*').remove();
      const width = 600;
      const height = 400;

      switch (currentVisualization) {
        case 'Shot Chart':
          // Shot Chart implementation here
          svg.append('image')
            .attr('xlink:href', '/path/to/basketball-court.svg')
            .attr('width', width)
            .attr('height', height);

          const xScale = d3.scaleLinear().domain([0, 50]).range([0, width]);
          const yScale = d3.scaleLinear().domain([0, 94]).range([height, 0]);

          svg.selectAll('.shot')
            .data(stats)
            .enter().append('circle')
            .attr('class', 'shot')
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 5)
            .attr('fill', d => d.result === 'made' ? 'green' : 'red');
          break;

        case 'Heat Map':
          // Heat Map implementation here
          const heatMapData = d3.histogram()
            .domain([0, 50])
            .thresholds(20)
            .value(d => d.x)(stats);

          const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
            .domain([0, d3.max(heatMapData, d => d.length)]);

          svg.append('image')
            .attr('xlink:href', '/path/to/basketball-court.svg')
            .attr('width', width)
            .attr('height', height);

          svg.selectAll('.heat')
            .data(heatMapData)
            .enter().append('rect')
            .attr('class', 'heat')
            .attr('x', d => xScale(d.x0))
            .attr('y', d => yScale(d.x1))
            .attr('width', d => xScale(d.x1) - xScale(d.x0))
            .attr('height', height / 20)
            .attr('fill', d => colorScale(d.length));
          break;

        case 'Radial Chart':
          // Radial Chart implementation here
          const radialData = [
            { axis: 'Points', value: d3.mean(stats, d => d.pts) },
            { axis: 'Assists', value: d3.mean(stats, d => d.ast) },
            { axis: 'Rebounds', value: d3.mean(stats, d => d.reb) },
            { axis: 'Steals', value: d3.mean(stats, d => d.stl) },
            { axis: 'Blocks', value: d3.mean(stats, d => d.blk) }
          ];

          const radialScale = d3.scaleLinear()
            .domain([0, d3.max(radialData, d => d.value)])
            .range([0, 150]);

          const line = d3.lineRadial()
            .radius(d => radialScale(d.value))
            .angle((d, i) => i * (2 * Math.PI / radialData.length));

          svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`)
            .append('path')
            .datum(radialData)
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', 2);
          break;

        case 'Shot Trajectories':
          // Shot Trajectories implementation here
          svg.append('image')
            .attr('xlink:href', '/path/to/basketball-court.svg')
            .attr('width', width)
            .attr('height', height);

          stats.forEach(d => {
            const arc = d3.arc()
              .innerRadius(0)
              .outerRadius(d.pts * 5)
              .startAngle(0)
              .endAngle(Math.PI / 2);

            svg.append('path')
              .attr('d', arc)
              .attr('transform', `translate(${xScale(d.x)},${yScale(d.y)})`)
              .attr('fill', d.result === 'made' ? 'green' : 'red');
          });
          break;

        case '3D Court':
          // 3D Court implementation here
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
          const renderer = new THREE.WebGLRenderer();
          renderer.setSize(width, height);
          document.getElementById('3d-court').appendChild(renderer.domElement);

          const courtGeometry = new THREE.PlaneGeometry(50, 94);
          const courtMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const court = new THREE.Mesh(courtGeometry, courtMaterial);
          scene.add(court);

          stats.forEach(d => {
            const shotGeometry = new THREE.SphereGeometry(0.5, 32, 32);
            const shotMaterial = new THREE.MeshBasicMaterial({ color: d.result === 'made' ? 0x00ff00 : 0xff0000 });
            const shot = new THREE.Mesh(shotGeometry, shotMaterial);
            shot.position.set(d.x, d.y, 0);
            scene.add(shot);
          });

          camera.position.z = 100;

          const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
          };

          animate();
          break;

        default:
          break;
      }
    }
  }, [stats, currentVisualization]);

  return (
    <div>
      <h2>Team Stats</h2>
      <div>
        <label htmlFor="player-select">Select Player: </label>
        <select
          id="player-select"
          onChange={e => setSelectedPlayer(players.find(player => player.id === parseInt(e.target.value)))}
        >
          <option value="">All Players</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>{player.first_name} {player.last_name}</option>
          ))}
        </select>
      </div>
      <VisualizationToggle
        visualizations={visualizations}
        currentVisualization={currentVisualization}
        setCurrentVisualization={setCurrentVisualization}
      />
      <div id="visualization-container">
        {currentVisualization === '3D Court' ? (
          <div id="3d-court" style={{ width: '600px', height: '400px' }}></div>
        ) : (
          <svg id="court" width="600" height="400"></svg>
        )}
      </div>
    </div>
  );
};

export default TeamStats;
