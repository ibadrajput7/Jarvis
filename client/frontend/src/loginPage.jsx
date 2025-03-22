import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AiVideo from "./assets/ai.mp4"; // Background Video
import "./LoginPage.css"; // AI-Themed Styles

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading animation

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login", formData);
      localStorage.setItem("token", response.data.access_token);
      setTimeout(() => navigate("/dashboard"), 1500); // Smooth transition
    } catch (error) {
      setError("Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div className="position-relative vh-100">
      {/* Background Video */}
      <video className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" autoPlay loop muted>
        <source src={AiVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Login Form Container */}
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <div className="login-card p-4">
          <h3 className="ai-title mb-3">Login to <span className="jarvis">Jarvis</span></h3>
          {error && <p className="text-danger">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="username"
                className="form-control ai-input"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control ai-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn ai-black-btn w-100">
              {loading ? <span className="loading-text">Authenticating...</span> : "Login"}
            </button>
          </form>

          <p className="mt-3">
            Don't have an account?{" "}
            <span className="text-primary create-account" onClick={() => navigate("/register")}>
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
