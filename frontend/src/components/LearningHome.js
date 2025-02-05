import AssignmentIcon from "@mui/icons-material/Assignment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleIcon from "@mui/icons-material/People"; // Import the new icon
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { haveUserManagementAccess } from "../constants/UserTypes";
import About from "./About";
import "./LearningHome.css";
import UsersListView from "./UserListView"; // Import the new component

const LearningHome = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authUser.token");
    const authUserType = localStorage.getItem("authUser.type");
    console.log("authUserType", authUserType);
    if (!authToken) {
      navigate("/login");
    } else {
      setUserType(authUserType);
    }
  }, [navigate]);

  return (
    <div className="learning-home-page">
      <nav className="left-nav">
        <Link to="/learning-home/" className="nav-item">
          <HomeIcon fontSize="large" />
          <span>Home</span>
        </Link>
        <Link to="/learning-home/dashboard" className="nav-item">
          <DashboardIcon fontSize="large" />
          <span>My Dashboard</span>
        </Link>
        <Link to="/learning-home/course-catalog" className="nav-item">
          <MenuBookIcon fontSize="large" />
          <span>Course Catalog</span>
        </Link>
        <Link to="/learning-home/projects" className="nav-item">
          <AssignmentIcon fontSize="large" />
          <span>Projects</span>
        </Link>
        {haveUserManagementAccess(userType) && (
          <>
            <Link to="/learning-home/users" className="nav-item">
              <PeopleIcon fontSize="large" />
              <span>Users</span>
            </Link>
          </>
        )}
        <Link to="/learning-home/feedback" className="nav-item">
          <FeedbackIcon fontSize="large" />
          <span>Feedback</span>
        </Link>
        <Link to="/logout" className="nav-item">
          <ExitToAppIcon fontSize="large" />
          <span>Logout</span>
        </Link>
        <Link to="/learning-home/about" className="nav-item">
          <InfoIcon fontSize="large" />
          <span>About</span>
        </Link>
      </nav>
      <div className="content">
        <Routes>
          <Route path="about" element={<About />} />
          <Route path="users" element={<UsersListView />} />
          {/* Add more routes here */}
        </Routes>
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
