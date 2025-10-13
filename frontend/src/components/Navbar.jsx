import { Link } from 'react-router-dom';
import config from '../config/config';

function Navbar() {
  const navStyle = {
    background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.darkGreen} 100%)`,
    padding: '1.2rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const titleStyle = {
    color: config.colors.white,
    fontSize: '1.8rem',
    fontWeight: '700',
    textDecoration: 'none',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const logoStyle = {
    fontSize: '2rem'
  };

  const linksStyle = {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap'
  };

  const linkStyle = {
    color: config.colors.white,
    textDecoration: 'none',
    fontSize: '0.95rem',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)'
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={titleStyle}>
        <span style={logoStyle}>🎯</span>
        <span>HobbyHub</span>
      </Link>
      <div style={linksStyle}>
        <Link to="/" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}>
          All Sessions
        </Link>
        <Link to="/create" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}>
          Create
        </Link>
        <Link to="/ai-suggest" style={{...linkStyle, backgroundColor: config.colors.accent}} onMouseEnter={(e) => e.target.style.opacity = '0.9'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
          🤖 AI
        </Link>
        <Link to="/private" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}>
          Private
        </Link>
        <Link to="/manage" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}>
          Manage
        </Link>
        <Link to="/leave" style={linkStyle} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}>
          Leave
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;