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
  const [showModal, setShowModal] = useState(false);

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
      setShowModal(true);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCodes(null);
    navigate('/');
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

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: config.colors.white,
    padding: '2.5rem',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
  };

  const okButtonStyle = {
    backgroundColor: config.colors.primary,
    color: config.colors.white,
    padding: '0.75rem 2rem',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
    marginTop: '1.5rem'
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

      {/* Success Modal */}
      {showModal && codes && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ color: config.colors.primary, marginBottom: '1rem' }}>
              🎉 Session Created Successfully!
            </h2>
            
            <div style={{
              backgroundColor: config.colors.light,
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <h3 style={{ color: config.colors.dark, marginBottom: '1rem' }}>
                ⚠️ Important! Save These Codes:
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Management Code:</strong>
                <p style={{
                  backgroundColor: config.colors.white,
                  padding: '0.75rem',
                  borderRadius: '5px',
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  marginTop: '0.5rem',
                  border: `2px solid ${config.colors.primary}`
                }}>
                  {codes.management_code}
                </p>
              </div>

              {codes.private_code && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Private Session Code:</strong>
                  <p style={{
                    backgroundColor: config.colors.white,
                    padding: '0.75rem',
                    borderRadius: '5px',
                    fontFamily: 'monospace',
                    fontSize: '1.1rem',
                    marginTop: '0.5rem',
                    border: `2px solid ${config.colors.warning}`
                  }}>
                    {codes.private_code}
                  </p>
                </div>
              )}

              <p style={{ fontSize: '0.9rem', color: config.colors.text, marginTop: '1rem' }}>
                💡 You need the management code to edit or delete your session later!
              </p>

              {codes.email_sent && (
                <p style={{
                  fontSize: '0.9rem',
                  color: config.colors.secondary,
                  marginTop: '1rem',
                  fontWeight: 'bold'
                }}>
                  ✅ Codes have also been sent to your email!
                </p>
              )}
            </div>

            <button style={okButtonStyle} onClick={handleCloseModal}>
              OK, Got It!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateSession;