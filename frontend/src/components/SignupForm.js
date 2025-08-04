import React, { useState } from 'react';
import API from '../api';

const SignupForm = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/signup', form);
      alert("Signup successful. You can now log in.");
    } catch (err) {
      alert("Signup failed: " + err.response.data.detail);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Username" onChange={(e) => setForm({...form, username: e.target.value})} />
      <input placeholder="Email" onChange={(e) => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={(e) => setForm({...form, password: e.target.value})} />
      <button type="submit">Signup</button>
    </form>
  );
};

export default SignupForm;
