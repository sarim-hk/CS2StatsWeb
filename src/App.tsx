import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/player/:PlayerID" element={<Player />} />
            </Routes>
        </Router>
    );
}

export default App;
