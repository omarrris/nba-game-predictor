import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import TeamStats from './components/TeamStats';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/team-analysis" exact component={TeamStats} />
        {/* Add more routes here */}
      </Switch>
    </Router>
  );
}

export default App;
