import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProjectList({ token }) {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/projects', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err.response?.data || err.message);
      alert('Could not load projects');
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);

  return (
    <div>
      <h2>Your Projects</h2>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.title}</strong>: {project.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProjectList;
