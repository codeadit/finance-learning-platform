import AssignmentIcon from "@mui/icons-material/Assignment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import "./LearningHome.css";

const LearningHome = () => {
  return (
    <div className="learning-home-page">
      <nav className="left-nav">
        <Link to="/" className="nav-item">
          <HomeIcon fontSize="large" />
          <span>Home</span>
        </Link>
        <Link to="/dashboard" className="nav-item">
          <DashboardIcon fontSize="large" />
          <span>My Dashboard</span>
        </Link>
        <Link to="/course-catalog" className="nav-item">
          <MenuBookIcon fontSize="large" />
          <span>Course Catalog</span>
        </Link>
        <Link to="/projects" className="nav-item">
          <AssignmentIcon fontSize="large" />
          <span>Projects</span>
        </Link>
        <Link to="/feedback" className="nav-item">
          <FeedbackIcon fontSize="large" />
          <span>Feedback</span>
        </Link>
        <Link to="/logout" className="nav-item">
          <ExitToAppIcon fontSize="large" />
          <span>Logout</span>
        </Link>
        <Link to="/about" className="nav-item">
          <InfoIcon fontSize="large" />
          <span>About</span>
        </Link>
      </nav>
      <div className="content">
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: "url(/background.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.1, // 30% transparency
              zIndex: -1,
            },
          }}
        >
          <h1>Welcome to the Learning Home Page</h1>
          {/* Add more content here */}
        </Box>
      </div>
    </div>
  );
};

export default LearningHome;
