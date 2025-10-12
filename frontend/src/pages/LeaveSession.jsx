import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

function LeaveSession() {
  const navigate = useNavigate();
  const [attendanceCode, setAttendanceCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLeave = async () => {
    if (!attendanceCode.trim()) {
      alert('Please enter your attendance code');
      return;
    }

    if (!window.confirm('Are you sure you want to leave this session?')) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`${config.API_URL}/attendance/leave`, {
        data: { attendance_code: attendanceCode }
      });
      
      alert('You have successfully left the session!');
      setAttendanceCode('');
      navigate('/');
    } catch (error) {
      console.error('Error leaving session:', error);
      alert(error.response?.data?.error || 'Failed to leave session. Check your code.');
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
    backgroundColor: config.colors.danger,
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
      <h1 style={titleStyle}>Leave Session</h1>

      <div style={cardStyle}>
        <div style={infoStyle}>
          <strong>Note:</strong> You received your attendance code when you joined a session. 
          Enter it below to remove yourself from the session.
        </div>

        <input
          style={inputStyle}
          type="text"
          placeholder="Enter your attendance code"
          value={attendanceCode}
          onChange={(e) => setAttendanceCode(e.target.value)}
        />

        <button
          style={buttonStyle}
          onClick={handleLeave}
          disabled={loading}
        >
          {loading ? 'Leaving...' : 'Leave Session'}
        </button>
      </div>
    </div>
  );
}

export default LeaveSession;