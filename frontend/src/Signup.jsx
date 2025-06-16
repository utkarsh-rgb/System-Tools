import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/signup', form);
      setMessage(res.data.message || "User registered successfully");
      setForm({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
  <div className="card shadow-lg" style={{width: '450px'}}>
    <div className="card-body p-4">
      <h2 className="card-title text-center mb-4 fw-bold text-primary">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            name="username"
            type="text"
            className="form-control form-control-lg"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="name"
            type="text"
            className="form-control form-control-lg"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="email"
            type="email"
            className="form-control form-control-lg"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <div className="input-group input-group-lg">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div className="mb-3">
          <input
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            className="form-control form-control-lg"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="showPasswordCheck"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label className="form-check-label" htmlFor="showPasswordCheck">
            Show Password
          </label>
        </div>
        <div className="d-grid mb-3">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>
      </form>
      
      {message && (
        <div className={`alert ${message.toLowerCase().includes('failed') || message.toLowerCase().includes('error') ? 'alert-danger' : 'alert-success'} text-center`} role="alert">
          {message}
        </div>
      )}
      
      <p className="text-center text-muted mt-3">
        Already have an account? <Link to="/login" className="text-decoration-none fw-semibold">Login</Link>
      </p>
    </div>
  </div>
</div>
  );
}
