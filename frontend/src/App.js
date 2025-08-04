// src/App.js
import React from "react";
import ProjectManagementPage from "./pages/ProjectManagementPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
             
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-projects"
          element={
            <PrivateRoute>
              <ProjectManagementPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
