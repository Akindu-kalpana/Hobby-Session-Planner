import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AllSessions from './pages/AllSessions';
import CreateSession from './pages/CreateSession';
import SessionDetails from './pages/SessionDetails';
import ManageSession from './pages/ManageSession';
import LeaveSession from './pages/LeaveSession';
import PrivateSession from './pages/PrivateSession';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<AllSessions />} />
            <Route path="/create" element={<CreateSession />} />
            <Route path="/session/:id" element={<SessionDetails />} />
            <Route path="/manage" element={<ManageSession />} />
            <Route path="/leave" element={<LeaveSession />} />
            <Route path="/private" element={<PrivateSession />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;