import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

function CreateSession() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    max_participants: '',
    session_type: 'public',
    location: '',
    creator_email: ''
  });

  const [codes, setCodes] = useState(null);

  // handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${config.API_URL}/sessions`, formData);
      setCodes(response.data);
      alert('Session created successfully!');
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session');
    }
  };

  const pageStyle = {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto'
  };

  const formStyle = {
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
    width: '100%'
  };

  const codeBoxStyle = {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: config.colors.light,
    borderRadius: '5px'
  };

  return (
    <div style={pageStyle}>
      <h1 style={{ color: config.colors.dark }}>Create New Session</h1>
      
      <form onSubmit={handleSubmit} style={formStyle}>
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

        <select
          style={inputStyle}
          name="session_type"
          value={formData.session_type}
          onChange={handleChange}
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <input
          style={inputStyle}
          type="email"
          name="creator_email"
          placeholder="Your Email (optional)"
          value={formData.creator_email}
          onChange={handleChange}
        />

        <button type="submit" style={buttonStyle}>
          Create Session
        </button>
      </form>

      {codes && (
        <div style={codeBoxStyle}>
          <h3>Important! Save these codes:</h3>
          <p><strong>Management Code:</strong> {codes.management_code}</p>
          {codes.private_code && (
            <p><strong>Private Code:</strong> {codes.private_code}</p>
          )}
          <p style={{fontSize: '0.9rem', color: config.colors.text}}>
            You need these codes to edit or delete your session later!
          </p>
        </div>
      )}
    </div>
  );
}

export default CreateSession;