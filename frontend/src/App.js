import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./components/Login"; // Create this component
import Register from "./components/Register"; // Create this component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
