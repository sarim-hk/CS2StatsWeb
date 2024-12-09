import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';
import Match from './pages/Match';
import Balancer from './pages/Balancer';
import Matches from './pages/Matches';
import Players from './pages/Players';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/players" element={<Players />} />
                <Route path="/balancer" element={<Balancer />} />

                <Route path="/player/:PlayerID" element={<Player />} />
                <Route path="/match/:MatchID" element={<Match />} />
            </Routes>
        </Router>
    );
}

export default App;
