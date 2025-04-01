import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import routes
import { Home } from './pages/Home';
import  Signup  from './pages/Signup';
import { Login } from './pages/Login'; // Import login page

const App: React.FC = () => {
  return (
    <Routes> {/* Use Routes for routing */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
