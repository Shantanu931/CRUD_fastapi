import React, { useState } from 'react';
import axios from 'axios';

const ProjectForm = ({ token, onProjectCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/projects', {
        title,
        description
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTitle('');
      setDescription('');
      onProjectCreated(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create project');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
  
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">Create Project</button>
    </form>
  );
};

export default ProjectForm;
