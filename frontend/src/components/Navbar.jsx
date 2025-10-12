import { Link } from 'react-router-dom';
import config from '../config/config';

function Navbar() {
  const navStyle = {
    backgroundColor: config.colors.primary,
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const titleStyle = {
    color: config.colors.white,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none'
  };

  const linksStyle = {
    display: 'flex',
    gap: '1.5rem'
  };

  const linkStyle = {
    color: config.colors.white,
    textDecoration: 'none',
    fontSize: '1rem',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    transition: 'background 0.3s'
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={titleStyle}>
        Hobby Session Planner
      </Link>
      <div style={linksStyle}>
        <Link to="/" style={linkStyle}>All Sessions</Link>
        <Link to="/create" style={linkStyle}>Create Session</Link>
      </div>
    </nav>
  );
}

export default Navbar;