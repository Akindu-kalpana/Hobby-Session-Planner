import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config/config';
import LocationMap from '../components/LocationMap';

function SessionDetails() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participantName, setParticipantName] = useState('');
  const [attendanceCode, setAttendanceCode] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedAttendeeId, setSelectedAttendeeId] = useState(null);
  const [managementCode, setManagementCode] = useState('');

  useEffect(() => {
    fetchSessionDetails();
    fetchAttendees();
  }, [id]);

  const fetchSessionDetails = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/sessions/${id}`);
      setSession(response.data.session);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching session:', error);
      setLoading(false);
    }
  };

  const fetchAttendees = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/attendance/session/${id}`);
      setAttendees(response.data.attendees);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  const handleJoinSession = async () => {
    if (!participantName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      const response = await axios.post(`${config.API_URL}/attendance/join`, {
        session_id: id,
        participant_name: participantName
      });
      setAttendanceCode(response.data.attendance_code);
      alert('Successfully joined the session!');
      fetchAttendees();
      setParticipantName('');
    } catch (error) {
      console.error('Error joining session:', error);
      alert(error.response?.data?.error || 'Failed to join session');
    }
  };

  const handleRemoveClick = (attendeeId) => {
    setSelectedAttendeeId(attendeeId);
    setShowRemoveModal(true);
  };

  const handleRemoveAttendee = async () => {
    if (!managementCode.trim()) {
      alert('Please enter the management code');
      return;
    }

    try {
      await axios.delete(`${config.API_URL}/attendance/remove/${selectedAttendeeId}`, {
        data: { management_code: managementCode }
      });
      alert('Attendee removed successfully!');
      setShowRemoveModal(false);
      setManagementCode('');
      setSelectedAttendeeId(null);
      fetchAttendees();
    } catch (error) {
      console.error('Error removing attendee:', error);
      alert(error.response?.data?.error || 'Failed to remove attendee. Check your management code.');
    }
  };

  const handleCancelRemove = () => {
    setShowRemoveModal(false);
    setManagementCode('');
    setSelectedAttendeeId(null);
  };

  const pageStyle = {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const cardStyle = {
    backgroundColor: config.colors.white,
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const titleStyle = {
    color: config.colors.primary,
    fontSize: '2rem',
    marginBottom: '1rem'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: `1px solid ${config.colors.light}`,
    borderRadius: '5px',
    fontSize: '1rem',
    marginRight: '1rem',
    width: '250px'
  };

  const buttonStyle = {
    backgroundColor: config.colors.secondary,
    color: config.colors.white,
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem'
  };

  const removeButtonStyle = {
    backgroundColor: config.colors.danger,
    color: config.colors.white,
    padding: '0.3rem 0.8rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    marginLeft: '1rem'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalStyle = {
    backgroundColor: config.colors.white,
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '90%'
  };

  if (loading) {
    return <div style={pageStyle}>Loading...</div>;
  }

  if (!session) {
    return <div style={pageStyle}>Session not found</div>;
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>{session.title}</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          {session.description}
        </p>
        <p><strong>Date:</strong> {session.date}</p>
        <p><strong>Time:</strong> {session.time}</p>
        <p><strong>Location:</strong> {session.location || 'Not specified'}</p>
        <p><strong>Max Participants:</strong> {session.max_participants}</p>
        <p><strong>Current Attendees:</strong> {attendees.length}</p>
        <p><strong>Type:</strong> {session.session_type}</p>
        
        {/* Map */}
        {session.location && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: config.colors.dark }}>Location Map</h3>
            <p style={{ fontSize: '0.9rem', color: config.colors.text, marginBottom: '0.5rem' }}>
              Tip: Enter location as "latitude,longitude" for accurate mapping (e.g., "65.0121,25.4651")
            </p>
            <LocationMap location={session.location} title={session.title} />
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: config.colors.dark }}>Join This Session</h2>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Your name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
          />
          <button style={buttonStyle} onClick={handleJoinSession}>
            I'm Going!
          </button>
        </div>
        
        {attendanceCode && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: config.colors.light,
            borderRadius: '5px'
          }}>
            <p><strong>Your Attendance Code:</strong> {attendanceCode}</p>
            <p style={{ fontSize: '0.9rem', color: config.colors.text }}>
              Save this code to remove your attendance later!
            </p>
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: config.colors.dark }}>Attendees ({attendees.length})</h2>
        {attendees.length === 0 ? (
          <p>No one has joined yet. Be the first!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {attendees.map(attendee => (
              <li key={attendee.id} style={{
                padding: '0.5rem 0',
                borderBottom: `1px solid ${config.colors.light}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{attendee.participant_name}</span>
                <button
                  style={removeButtonStyle}
                  onClick={() => handleRemoveClick(attendee.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Remove Attendee Modal */}
      {showRemoveModal && (
        <div style={modalOverlayStyle} onClick={handleCancelRemove}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: config.colors.dark, marginBottom: '1rem' }}>
              Remove Attendee
            </h3>
            <p style={{ marginBottom: '1rem', color: config.colors.text }}>
              Enter your management code to remove this attendee:
            </p>
            <input
              style={inputStyle}
              type="text"
              placeholder="Management code"
              value={managementCode}
              onChange={(e) => setManagementCode(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                style={{...buttonStyle, flex: 1}}
                onClick={handleCancelRemove}
              >
                Cancel
              </button>
              <button
                style={{...removeButtonStyle, flex: 1, marginLeft: 0}}
                onClick={handleRemoveAttendee}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionDetails;