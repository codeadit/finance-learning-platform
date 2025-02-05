import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Home";
import About from "./components/About"; // Create this component
import LearningHome from "./components/LearningHome";
import Login from "./components/Login"; // Create this component
import Logout from "./components/Logout";
import Register from "./components/Register"; // Create this component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/learning-home/*" element={<LearningHome />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
