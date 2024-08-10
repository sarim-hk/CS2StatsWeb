import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';
import Match from './pages/Match';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/player/:PlayerID" element={<Player />} />
                <Route path="/match/:MatchID" element={<Match />} />
            </Routes>
        </Router>
    );
}

export default App;
