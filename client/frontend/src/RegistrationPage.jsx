import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AiVideo from "./assets/ai.mp4"; // Background video
import "./LoginPage.css"; // Shared styles

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Registration failed!");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Video */}
      <video className="background-video" autoPlay loop muted>
        <source src={AiVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Registration Form (Same Style as Login Form) */}
      <div className="login-box">
        <h4 className="ai-title">Sign Up</h4>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            className="form-control ai-input"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="form-control ai-input"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="form-control ai-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn ai-black-btn w-100">
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-2">
          Already have an account?{" "}
          <span className="text-primary create-account" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
