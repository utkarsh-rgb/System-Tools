import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";import { useNavigate } from "react-router-dom"; 


export default function ForgotPassword() {
  const { token } = useParams();
    const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassinput, setShowPassinput] = useState(false);
  const [loading, setLoading] = useState(false);

  //  If token exists in URL, validate it on mount
  useEffect(() => {
    if (token) {
      confirmToken();
    }
  }, [token]);


  const confirmToken = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/verify-token", {token,});
       console.log("Verify response:", res.data); // ✅
      if (res.data.success) {
        setShowPassinput(true);
        setMessage("Token verified. You can now reset your password.");
      } else {
        setMessage("Invalid or expired token.");
      }
    } catch (error) {
      setMessage("Error verifying token.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 1: Submit email to get reset link
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/forgot-password", {
        email,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred.");
    }
  };

  // ✅ Step 2: Submit new password after token verification
   const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:5000/reset-password", {
        token,
        newPassword,
      });
      console.log("Sending:", { token, newPassword });
      setMessage(res.data.message);

    
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3>Forgot Password</h3>
      {loading && <p>Loading...</p>}
      
      {!token && !showPassinput && (
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-primary w-100" type="submit">
            Send Reset Link
          </button>
        </form>
      )}

      {showPassinput && (
        <form onSubmit={handlePasswordReset}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button className="btn btn-success w-100" type="submit">
            Reset Password
          </button>
        </form>
      )}

      {message && <p className="text-center mt-3">{message}</p>}
    </div>
  );
}
