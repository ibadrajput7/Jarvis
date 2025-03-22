import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./loginPage";
import RegistrationPage from "./RegistrationPage";
import Dashboard from "./dashboard";
import LandingPage from "./landingpage";

function App() {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
