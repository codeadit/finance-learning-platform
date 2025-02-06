import HomeIcon from "@mui/icons-material/Home";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { backgroundStyle } from "../constants/styles";

const About = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div>
      <Container sx={backgroundStyle}>
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
        <Typography variant="h1" component="h1" gutterBottom>
          About Us
        </Typography>
        <Grid container direction="column" justifyContent="center" spacing={4}>
          <Grid item>
            <Box>
              <Typography variant="h2" component="h2" gutterBottom>
                What will you learn?
              </Typography>
              <Typography variant="body1">Here we describe what users will learn from our platform.</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box>
              <Typography variant="h2" component="h2" gutterBottom>
                Why is it important?
              </Typography>
              <Typography variant="body1">Here we explain the importance of the knowledge and skills provided.</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box>
              <Typography variant="h2" component="h2" gutterBottom>
                How do we help the underserved?
              </Typography>
              <Typography variant="body1">Here we detail our efforts to support underserved communities.</Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box>
              <Typography variant="h2" component="h2" gutterBottom>
                Leadership Team
              </Typography>
              <Typography variant="body1">Here we introduce our leadership team.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default About;
