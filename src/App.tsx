import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';
import Match from './pages/Match';
import Stats from './pages/Stats';
import Team from './pages/Team';
import NotFound from './pages/NotFound';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stats" element={<Stats />} />

                <Route path="/player/:PlayerID" element={<Player />} />
                <Route path="/match/:MatchID" element={<Match />} />
                <Route path="/team/:TeamID" element={<Team />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
