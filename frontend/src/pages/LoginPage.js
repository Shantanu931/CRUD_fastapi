// src/pages/LoginPage.js
import React from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #8E2DE2, #4A00E0)",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>Login</h2>
        <LoginForm />

        <p style={{ marginTop: "20px" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#4F46E5", fontWeight: "bold" }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
