// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectForm from "../components/ProjectForm";

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:8000/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (error.response && error.response.status === 401) {
          window.location.href = "/login";
        }
      }
    };

    fetchProjects();
  }, [refresh, token]);

  const handleProjectCreated = () => {
    setRefresh(!refresh);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #7F7FD5, #86A8E7, #91EAE4)",
        padding: "20px"
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "600px"
        }}
      >
        <h1 style={{ textAlign: "center", fontWeight: "bold", color: "#222" }}>
          Dashboard
        </h1>

        <h2 style={{ marginTop: "20px", color: "#333" }}>Create a New Project</h2>
        <ProjectForm token={token} onProjectCreated={handleProjectCreated} />

        <h2 style={{ marginTop: "30px", color: "#333" }}>Your Projects</h2>
        {projects.length === 0 ? (
          <p style={{ color: "#666" }}>No projects found.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id} style={{ marginBottom: "8px" }}>
                <strong>{project.title}</strong> — {project.description}
              </li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#6366F1",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s ease"
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#4F46E5")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#6366F1")}
          >
            Logout
          </button>
        </div>
        <button onClick={() => window.location.href = "/manage-projects"}>
         Manage Projects
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
