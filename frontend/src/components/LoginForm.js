import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const form = new URLSearchParams();
    form.append("username", formData.username);
    form.append("password", formData.password);

    try {
      const response = await axios.post("http://localhost:8000/token", form);
      const { access_token, user } = response.data;

      // ✅ Store JWT token
      localStorage.setItem("access_token", access_token); // ✅ consistent


      // ✅ Optionally store user details
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Username:</label><br />
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label><br />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
