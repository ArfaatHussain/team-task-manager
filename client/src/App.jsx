import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/NavBar';
import TeamsPage from './pages/TeamsPage';
import TeamDetailsPage from './pages/TeamDetailsPage';
import toast, { Toaster } from 'react-hot-toast';
import ViewTasksOfMember from './pages/ViewTasksOfMember';
import ViewEnrolledTeamDetails from './pages/ViewEnrolledTeamDetail';
import TasksPage from './pages/TasksPage';

const App = () => {
  return (
    <Router>
      <AppRoutes />
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
    </Router>
  );
};

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const onLoginOrRegister = location.pathname === '/login' || location.pathname === '/register';

    if (accessToken) {
      setIsAuthenticated(true);
      if (onLoginOrRegister) {
        navigate('/'); // redirect logged-in user away from login/register
      }
    } else {
      setIsAuthenticated(false);
      if (!onLoginOrRegister) {
        navigate('/login'); // redirect guest user to login
      }
    }
  }, [location.pathname, navigate]);

  if (isAuthenticated === null) {
    // still checking auth status
    return null; // or loading spinner
  }

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
          <Route path="/enrolledTeam/:teamId/:name/:description" element={<ViewEnrolledTeamDetails />} />
          <Route path="/team/:memberId" element={<ViewTasksOfMember />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
