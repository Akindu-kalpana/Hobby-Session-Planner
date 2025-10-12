import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config/config';

function AllSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch sessions when page loads
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/sessions`);
      setSessions(response.data.sessions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const pageStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: config.colors.dark,
    marginBottom: '2rem'
  };

  const sessionCardStyle = {
    backgroundColor: config.colors.white,
    padding: '1.5rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: `1px solid ${config.colors.light}`
  };

  const sessionTitleStyle = {
    color: config.colors.primary,
    fontSize: '1.5rem',
    marginBottom: '0.5rem'
  };

  if (loading) {
    return <div style={pageStyle}>Loading sessions...</div>;
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>All Sessions</h1>
      
      {sessions.length === 0 ? (
        <p>No sessions available. Create one!</p>
      ) : (
        sessions.map(session => (
          <div key={session.id} style={sessionCardStyle}>
            <h2 style={sessionTitleStyle}>{session.title}</h2>
            <p>{session.description}</p>
            <p><strong>Date:</strong> {session.date} at {session.time}</p>
            <p><strong>Location:</strong> {session.location || 'Not specified'}</p>
            <Link 
              to={`/session/${session.id}`}
              style={{
                color: config.colors.primary,
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              View Details →
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default AllSessions;