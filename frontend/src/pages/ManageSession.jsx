import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

function ManageSession() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: enter code, 2: show edit form
  const [sessionId, setSessionId] = useState('');
  const [managementCode, setManagementCode] = useState('');
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);

  // form data for editing
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    max_participants: '',
    location: ''
  });

  // verify management code and load session
  const handleVerify = async () => {
    if (!sessionId || !managementCode) {
      alert('Please enter both Session ID and Management Code');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${config.API_URL}/sessions/${sessionId}`);
      const session = response.data.session;

      // debug - see what we got
      console.log('Session data:', session);
      console.log('Your code:', managementCode);
      console.log('Correct code:', session.management_code);

      // check if management code matches
      if (session.management_code === managementCode) {
        setSessionData(session);
        setFormData({
          title: session.title,
          description: session.description || '',
          date: session.date,
          time: session.time,
          max_participants: session.max_participants,
          location: session.location || ''
        });
        setStep(2);
      } else {
        alert('Invalid management code!');
      }
    } catch (error) {
      console.error('Error verifying:', error);
      alert('Session not found or invalid code');
    }
    setLoading(false);
  };

  // handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // update session
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put(
        `${config.API_URL}/sessions/${sessionId}/manage?code=${managementCode}`,
        formData
      );
      alert('Session updated successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Failed to update session');
    }
  };

  // delete session
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this session? This cannot be undone!')) {
      return;
    }

    try {
      await axios.delete(
        `${config.API_URL}/sessions/${sessionId}/manage?code=${managementCode}`
      );
      alert('Session deleted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session');
    }
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
    width: '100%',
    marginTop: '1rem'
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: config.colors.danger,
    marginTop: '2rem'
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ color: config.colors.dark, marginBottom: '2rem' }}>
        Manage Session
      </h1>

      {step === 1 ? (
        // Step 1: Enter management code
        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', color: config.colors.dark }}>
            Enter Your Management Code
          </h2>
          <p style={{ marginBottom: '1.5rem', color: config.colors.text }}>
            You received this code when you created the session.
          </p>

          <input
            style={inputStyle}
            type="number"
            placeholder="Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />

          <input
            style={inputStyle}
            type="text"
            placeholder="Management Code"
            value={managementCode}
            onChange={(e) => setManagementCode(e.target.value)}
          />

          <button
            style={buttonStyle}
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </div>
      ) : (
        // Step 2: Edit form
        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', color: config.colors.dark }}>
            Edit Session: {sessionData?.title}
          </h2>

          <form onSubmit={handleUpdate}>
            <input
              style={inputStyle}
              type="text"
              name="title"
              placeholder="Session Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <textarea
              style={{...inputStyle, minHeight: '100px'}}
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />

            <input
              style={inputStyle}
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />

            <input
              style={inputStyle}
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />

            <input
              style={inputStyle}
              type="number"
              name="max_participants"
              placeholder="Maximum Participants"
              value={formData.max_participants}
              onChange={handleChange}
              required
            />

            <input
              style={inputStyle}
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <button type="submit" style={buttonStyle}>
              Update Session
            </button>
          </form>

          <button style={deleteButtonStyle} onClick={handleDelete}>
            Delete Session
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageSession;