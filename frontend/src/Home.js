import { Box, Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";
import { backgroundStyle } from "./constants/styles";

const GradientText = styled(Typography)({
  background: "linear-gradient(45deg, #00008B 30%, #0000CD 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "bold",
  padding: "20px 0",
});

const Home = () => {
  return (
    <Box sx={backgroundStyle}>
      <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
        <GradientText variant="h3" component="h1" gutterBottom>
          Welcome to the Financial Learning Platform
        </GradientText>
        <Box mt={4}>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" style={{ margin: "10px" }}>
              Register
            </Button>
          </Link>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="secondary" style={{ margin: "10px" }}>
              Login
            </Button>
          </Link>
          <Link to="/about" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="success" style={{ margin: "10px" }}>
              About
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
