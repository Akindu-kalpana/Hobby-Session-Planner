import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config/config';

function AllSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, upcoming, past

  // fetch sessions when page loads or filters change
  useEffect(() => {
    fetchSessions();
  }, [filterType]);

  const fetchSessions = async () => {
    try {
      let url = `${config.API_URL}/sessions?`;
      
      // add filter parameter
      if (filterType === 'upcoming') {
        url += 'upcoming=true';
      } else if (filterType === 'past') {
        url += 'upcoming=false';
      }
      
      const response = await axios.get(url);
      setSessions(response.data.sessions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  // search locally in the fetched sessions
  const filteredSessions = sessions.filter(session => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    
    // format date for better searching (e.g., "2025-12-25" becomes "2025 12 25" and "25-12-2025")
    const dateFormatted = session.date ? session.date.replace(/-/g, ' ') : '';
    const dateReversed = session.date ? session.date.split('-').reverse().join(' ') : '';
    
    return (
      session.title.toLowerCase().includes(search) ||
      session.description?.toLowerCase().includes(search) ||
      session.location?.toLowerCase().includes(search) ||
      session.date?.includes(search) ||
      dateFormatted.includes(search) ||
      dateReversed.includes(search) ||
      session.time?.includes(search)
    );
  });

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

  const searchBoxStyle = {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: `1px solid ${config.colors.light}`,
    borderRadius: '5px',
    marginBottom: '1.5rem'
  };

  const filterContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const filterButtonStyle = (isActive) => ({
    padding: '0.5rem 1.5rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    backgroundColor: isActive ? config.colors.primary : config.colors.light,
    color: isActive ? config.colors.white : config.colors.text,
    transition: 'all 0.3s'
  });

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
      
      {/* Search box */}
      <input
        style={searchBoxStyle}
        type="text"
        placeholder="Search by title, description, or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter buttons */}
      <div style={filterContainerStyle}>
        <button
          style={filterButtonStyle(filterType === 'all')}
          onClick={() => setFilterType('all')}
        >
          All Sessions
        </button>
        <button
          style={filterButtonStyle(filterType === 'upcoming')}
          onClick={() => setFilterType('upcoming')}
        >
          Upcoming
        </button>
        <button
          style={filterButtonStyle(filterType === 'past')}
          onClick={() => setFilterType('past')}
        >
          Past Sessions
        </button>
      </div>

      {/* Results count */}
      <p style={{ marginBottom: '1rem', color: config.colors.text }}>
        Showing {filteredSessions.length} session(s)
      </p>
      
      {/* Sessions list */}
      {filteredSessions.length === 0 ? (
        <p>No sessions found. Try a different search or create one!</p>
      ) : (
        filteredSessions.map(session => (
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