// src/pages/ProjectManagementPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ProjectManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const token = localStorage.getItem("access_token");

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:8000/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(res.data);
    } catch (err) {
      setError("Failed to load projects");
    }
  };

  const handleUpdate = async (id, newIssueCount) => {
    try {
      await axios.patch(
        `http://localhost:8000/projects/${id}`,
        { issues: newIssueCount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProjects(); // refresh
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchProjects();
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  fetchProjects();
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Projects</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Issue Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.description}</td>
              <td>
                <input
                  type="number"
                  value={p.issues || 0}
                  onChange={(e) =>
                    setProjects((prev) =>
                      prev.map((proj) =>
                        proj.id === p.id
                          ? { ...proj, issues: parseInt(e.target.value) }
                          : proj
                      )
                    )
                  }
                />
              </td>
              <td>
                <button onClick={() => handleUpdate(p.id, p.issues)}>
                  Update
                </button>
                {p.issues > 50 && (
                  <button
                    style={{ marginLeft: "10px", color: "red" }}
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
  onClick={() => navigate("/dashboard")}
  style={{
    marginBottom: "20px",
    padding: "8px 16px",
    backgroundColor: "#4F46E5",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }}
>
  ← Back to Dashboard
</button>
    </div>
  );
};

export default ProjectManagementPage;
