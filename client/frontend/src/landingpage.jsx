import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundVideo from "./assets/background.mp4";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for styling
import "./LandingPage.css"; // Custom styles

function LandingPage() {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(false);
  const [showContent, setShowContent] = useState(true);

  const handleGetStarted = () => {
    setShowContent(false); // Hide the title and button
    setIsInitializing(true); // Show initializing text

    setTimeout(() => {
      navigate("/login"); // Smooth redirect after 3 seconds
    }, 3000);
  };

  return (
    <div className="position-relative vh-100">
      {/* Background Video */}
      <video
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        autoPlay
        loop
        muted
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* AI-Themed Text & Button */}
      {showContent && (
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white fade-in">
          <h1 className="ai-title">Welcome To <span className="jarvis">Jarvis</span></h1>
          <button className="btn ai-darkblue-btn mt-3 px-4 py-2" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      )}

      {/* Initializing Text */}
      {isInitializing && (
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white fade-in">
          <h2 className="initializing-text">Initializing<span className="dots">...</span></h2>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
