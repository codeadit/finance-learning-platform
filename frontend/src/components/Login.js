import HomeIcon from "@mui/icons-material/Home";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  // Example of using the auth token for subsequent requests
  const fetchProtectedData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5005/protected-route", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Protected data:", res.data);
    } catch (error) {
      console.error("An error occurred while fetching protected data:", error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5005/user/login", formData);

      console.log(res.data);
      if (res.data.message === "Login successful") {
        localStorage.setItem("authToken", res.data.token);
        navigate("/learning-home/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid email or password. Please try again.",
        });
      }
    } catch (err) {
      console.error(err.response.data);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
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
          opacity: 0.3, // 30% transparency
          zIndex: -1,
        },
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleHomeClick}
        startIcon={<HomeIcon />}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 2,
        }}
      >
        Home
      </Button>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          "& .MuiTextField-root": { m: 1, width: "300px" },
          "& .MuiButton-root": { m: 1, width: "300px" },
        }}
      >
        <TextField type="email" name="email" label="Email" value={email} onChange={onChange} required />
        <TextField type="password" name="password" label="Password" value={password} onChange={onChange} required />
        <Button type="submit" variant="contained" color="primary">
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
