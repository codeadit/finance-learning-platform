import HomeIcon from "@mui/icons-material/Home";
import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { convertBackendToFrontendUserType } from "../../constants/UserTypes";
import { backgroundStyle } from "../../constants/styles";
import userService from "../../services/userService";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userService.loginUser(formData);

      console.log(res);
      if (res.message === "Login successful") {
        localStorage.setItem("authUser.token", res.token);
        const backendUserType = res.user_type;
        const frontendUserType = convertBackendToFrontendUserType(backendUserType);
        localStorage.setItem("authUser.type", frontendUserType);
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
