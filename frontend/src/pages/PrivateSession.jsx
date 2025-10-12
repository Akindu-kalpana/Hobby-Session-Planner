import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

function PrivateSession() {
  const navigate = useNavigate();
  const [privateCode, setPrivateCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccess = async () => {
    if (!privateCode.trim()) {
      alert('Please enter a private code');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${config.API_URL}/sessions/private/${privateCode}`);
      const session = response.data.session;
      
      // redirect to session details page
      navigate(`/session/${session.id}`);
    } catch (error) {
      console.error('Error accessing private session:', error);
      alert('Invalid private code or session not found');
    }
    setLoading(false);
  };

  const pageStyle = {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const cardStyle = {
    backgroundColor: config.colors.white,
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const titleStyle = {
    color: config.colors.dark,
    marginBottom: '1rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: `1px solid ${config.colors.light}`,
    borderRadius: '5px',
    fontSize: '1rem'
  };

  const buttonStyle = {
    backgroundColor: config.colors.primary,
    color: config.colors.white,
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%'
  };

  const infoStyle = {
    backgroundColor: config.colors.light,
    padding: '1rem',
    borderRadius: '5px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    color: config.colors.text
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Access Private Session</h1>

      <div style={cardStyle}>
        <div style={infoStyle}>
          <strong>Private sessions</strong> don't appear in the public list. 
          Enter the private code you received from the session creator to access it.
        </div>

        <input
          style={inputStyle}
          type="text"
          placeholder="Enter private session code"
          value={privateCode}
          onChange={(e) => setPrivateCode(e.target.value)}
        />

        <button
          style={buttonStyle}
          onClick={handleAccess}
          disabled={loading}
        >
          {loading ? 'Accessing...' : 'Access Session'}
        </button>
      </div>
    </div>
  );
}

export default PrivateSession;