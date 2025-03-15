import HomeIcon from "@mui/icons-material/Home";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { backgroundStyle } from "../../constants/styles";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", username: "" });

  const { username, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/user/register`, formData);
      console.log(res.data);
      if (res.data.message === "User already exists") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User already exists. Please try a different username.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User created successfully! Login to continue.",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          }
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
    <Box sx={backgroundStyle}>
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
          zIndex: 1,
          "& .MuiTextField-root": { m: 1, width: "300px" },
          "& .MuiButton-root": { m: 1, width: "300px" },
        }}
      >
        <TextField type="text" name="username" label="Username" value={username} onChange={onChange} required />
        <TextField type="email" name="email" label="Email" value={email} onChange={onChange} required />
        <TextField type="password" name="password" label="Password" value={password} onChange={onChange} required />
        <Button type="submit" variant="contained" color="primary">
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
