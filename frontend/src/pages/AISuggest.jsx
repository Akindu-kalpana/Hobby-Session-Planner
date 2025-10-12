import { useState } from 'react';
import axios from 'axios';
import config from '../config/config';

function AISuggest() {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(0);

  const handleGetSuggestion = async () => {
    setLoading(true);
    setSuggestion('');
    
    try {
      const response = await axios.post(`${config.API_URL}/ai/suggest`);
      setSuggestion(response.data.suggestion);
      setAnalyzed(response.data.sessions_analyzed);
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      alert('Failed to get AI suggestion. Check your API key.');
    }
    
    setLoading(false);
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
    color: config.colors.dark,
    marginBottom: '1rem'
  };

  const buttonStyle = {
    backgroundColor: config.colors.primary,
    color: config.colors.white,
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    width: '100%',
    marginTop: '1rem'
  };

  const suggestionBoxStyle = {
    backgroundColor: config.colors.light,
    padding: '1.5rem',
    borderRadius: '8px',
    marginTop: '2rem',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap'
  };

  const infoStyle = {
    fontSize: '0.9rem',
    color: config.colors.text,
    marginTop: '1rem'
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>AI Session Suggestions</h1>

      <div style={cardStyle}>
        <p style={{ marginBottom: '1rem', color: config.colors.text }}>
          Get AI-powered suggestions for your next hobby session! 
          Our AI analyzes your recent sessions and suggests new creative ideas.
        </p>

        <button
          style={buttonStyle}
          onClick={handleGetSuggestion}
          disabled={loading}
        >
          {loading ? '🤖 Thinking...' : '✨ Get AI Suggestion'}
        </button>

        {suggestion && (
          <div style={suggestionBoxStyle}>
            <h3 style={{ color: config.colors.primary, marginBottom: '1rem' }}>
              AI Suggestion:
            </h3>
            <p>{suggestion}</p>
            {analyzed > 0 && (
              <p style={infoStyle}>
                📊 Based on analysis of {analyzed} recent session(s)
              </p>
            )}
          </div>
        )}

        {!loading && !suggestion && (
          <p style={{ marginTop: '2rem', textAlign: 'center', color: config.colors.text }}>
            Click the button above to get your first AI suggestion!
          </p>
        )}
      </div>

      <div style={{...cardStyle, backgroundColor: config.colors.light}}>
        <h3 style={{ color: config.colors.dark, marginBottom: '0.5rem' }}>
          💡 How it works
        </h3>
        <p style={{ fontSize: '0.95rem', color: config.colors.text }}>
          The AI looks at your recent sessions and suggests new ideas based on patterns, 
          themes, and popular activities. Each suggestion is unique and creative!
        </p>
      </div>
    </div>
  );
}

export default AISuggest;