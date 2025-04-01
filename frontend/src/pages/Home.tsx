import React from 'react';
import { ReactTyped } from 'react-typed';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported
import { Header } from '../components/Header';
import homepageimg from '../assets/homepage.jpg';

export const Home: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSignUp = () => {
    navigate('/signup'); // Navigate to /signup when the button is clicked
  };

  return (
    <div>
      <Header />
      <div className="content">
        <div className="left-section">
          <h2>
            <ReactTyped
              strings={['Unleash Your Inner Champion']}
              typeSpeed={50}
              backSpeed={50}
              backDelay={500}
              startDelay={1000}
              loop={false}
              style={{ color: '#ffcc00' }}
            />
          </h2>
          <button onClick={handleSignUp} className="get-started-btn">
            Get Started →
          </button>
        </div>
        <div className="right-section">
          <img className="image" src={homepageimg} alt="Chess Game" />
        </div>
      </div>
    </div>
  );
};
