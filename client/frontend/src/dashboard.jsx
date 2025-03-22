import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import aiVideo from "./assets/ai.mp4";

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [jarvisActive, setJarvisActive] = useState(false);
  const [status, setStatus] = useState("idle");
  const wsRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    if (!token) {
      navigate("/login");
    } else {
      setUsername(storedUser || "User");
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [navigate]);

  const connectWebSocket = () => {
    wsRef.current = new WebSocket('ws://localhost:8000/ws/jarvis');
    
    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data.status);
      
      if (data.status === "stopped") {
        setJarvisActive(false);
      }
    };

    wsRef.current.onclose = () => {
      setJarvisActive(false);
      setStatus("idle");
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setJarvisActive(false);
      setStatus("idle");
    };
  };

  const toggleJarvis = () => {
    if (jarvisActive) {
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({ action: "stop" }));
        wsRef.current.close();
        setJarvisActive(false);
        setStatus("idle");
      }
    } else {
      connectWebSocket();
      setJarvisActive(true);
      setTimeout(() => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ action: "start" }));
        }
      }, 1000);
    }
  };

  const handleLogout = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const getButtonText = () => {
    switch (status) {
      case "listening":
        return "Listening...";
      case "speaking":
        return "Speaking...";
      case "processing":
        return "Processing...";
      default:
        return jarvisActive ? "Stop JARVIS" : "Activate JARVIS";
    }
  };

  return (
    <div className="dashboard-container">
      <video className="background-video" autoPlay loop muted>
        <source src={aiVideo} type="video/mp4" />
      </video>

      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <div className="overlay-content">
        <h2 className="welcome-text">Welcome back, {username}!</h2>
        <br />
        <button 
          className={`activate-btn ${status === "listening" ? "listening" : ""}`} 
          onClick={toggleJarvis}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;