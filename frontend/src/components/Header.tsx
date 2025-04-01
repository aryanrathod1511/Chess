import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/header.css';
import '../style/home.css';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="header">
      <h2>
        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Chess Master
        </a>
      </h2>

      <div className="auth">
        <button className="button" onClick={handleLogin}>Log In</button>
        <button className="button" onClick={handleSignup}>Sign Up</button>
      </div>
    </div>
  );
};
