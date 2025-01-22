import { Box, Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
import { Link } from "react-router-dom";

const GradientText = styled(Typography)({
  background: "linear-gradient(45deg, #00008B 30%, #0000CD 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "bold",
  padding: "20px 0",
});

const BackgroundBox = styled(Box)({
  position: "relative",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "url(/background.jpg)", // Update the path to your image
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.3, // Adjust the opacity to increase transparency
    zIndex: -1,
  },
});

const Home = () => {
  return (
    <BackgroundBox>
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
        </Box>
      </Container>
    </BackgroundBox>
  );
};

export default Home;
