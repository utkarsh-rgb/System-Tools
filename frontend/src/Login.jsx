import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard/home";

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      navigate("/dashboard/home");
    }
  }, [navigate]);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/login", {
        username: username.trim(),
        password,
      });

      const user = {
        username: res.data.username,
        role: res.data.role,
      };

      localStorage.setItem("userData", JSON.stringify(user));
      setMessage(res.data.message);
      if (res.data.role === "admin") {
  navigate("/dashboard/admin_dashboard", { replace: true });
} else {
  navigate("/dashboard/home", { replace: true });
}

    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "Login failed, please try again."
      );
      localStorage.removeItem("userData");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ width: "400px" }}>
        <div className="card-body p-4">
          <h1 className="card-title text-center mb-4 fw-bold text-primary">
            Login
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                ref={usernameRef}
                type="text"
                className="form-control form-control-lg"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setMessage("");
                }}
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-3">
              <div className="input-group input-group-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setMessage("");
                  }}
                  required
                  autoComplete="current-password"
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </button>
              </div>
            </div>
            <p className="text-end">
              <Link
                to="/forgot-password"
                className="text-decoration-none text-primary"
              >
                Forgot Password?
              </Link>
            </p>

            <div className="d-grid mb-3">
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading || !username.trim() || !password}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
          {message && (
            <div
              className={`alert ${
                message.toLowerCase().includes("success") ||
                message.toLowerCase().includes("welcome")
                  ? "alert-success"
                  : "alert-danger"
              } text-center`}
              role="alert"
              aria-live="polite"
            >
              {message}
            </div>
          )}
          <p className="text-center text-muted mt-3">
            Don't have an account?{" "}
            <Link to="/signup" className="text-decoration-none fw-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
