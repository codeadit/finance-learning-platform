import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CourseDialog = ({ open, onClose, onCreate }) => {
  const [course, setCourse] = useState({
    courseid: "",
    course_name: "",
    course_description: "",
    agestart: "",
    ageend: "",
    free_course: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(`${API_BASE_URL}/courses`, course, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onCreate(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Course</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Course ID"
          type="text"
          fullWidth
          name="courseid"
          value={course.courseid}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Course Name"
          type="text"
          fullWidth
          name="course_name"
          value={course.course_name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Course Description"
          type="text"
          fullWidth
          name="course_description"
          value={course.course_description}
          onChange={handleChange}
        />
        <TextField margin="dense" label="Min Age" type="number" fullWidth name="agestart" value={course.agestart} onChange={handleChange} />
        <TextField margin="dense" label="Max Age" type="number" fullWidth name="ageend" value={course.ageend} onChange={handleChange} />
        <Box display="flex" alignItems="center" mt={2}>
          <Checkbox name="free_course" checked={course.free_course} onChange={handleChange} />
          <span>Free Course</span>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDialog;
