import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/NavBar';
import TeamsPage from './pages/TeamsPage';
import TeamDetailsPage from './pages/TeamDetailsPage';

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setIsAuthenticated(true);
      if (location.pathname === '/login' || location.pathname === '/register') {
        navigate('/'); 
      }
    } else {
      setIsAuthenticated(false);
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login'); 
      }
    }
  }, [location, navigate]);

  return (
    <div>
      {isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register' && <Navbar />}
      
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/team/:teamId/:name/:description" element={<TeamDetailsPage />} />
          {/* <Route path="/tasks" element={<Tasks />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
