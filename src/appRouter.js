import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate  } from 'react-router-dom';
import Dashboard from './pages/main';
import Login from './security/login';
import GuestProjections from './pages/components/guestProjections';

const AppRouter = () => {


  const correctPin = '2019';


 

  const handleLogin = (pin) => {
  
    if (pin === correctPin) {
      sessionStorage.setItem("auth", "true");
      window.location.href = '/task-manager';
    } else {
      // Handle incorrect login
    }
  };

  



  const PrivateRoute = ({ element }) => {
    console.log("private Route")
    const navigate = useNavigate();
    const isAuthenticated = sessionStorage.getItem("auth") === "true";

    useEffect(() => {
      if (!isAuthenticated) {
        console.log("Not Auth")

        // If not authenticated, use the navigate function to redirect to '/'
        navigate('/', { replace: true });
      }
  
    }, [navigate]);

    console.log("Auth")

    return isAuthenticated ? element : null;
  };

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/task-manager" element={<PrivateRoute element={<Dashboard/>} />} />
      <Route path="/guest-projections" element={<PrivateRoute element={<GuestProjections/>} />} />


      </Routes>
    </Router>
  );
};

export default AppRouter;
