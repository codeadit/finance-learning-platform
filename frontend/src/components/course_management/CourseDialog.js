import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CourseDialog = ({ open, onClose, onCreate, fieldsOfStudy }) => {
  const [course, setCourse] = useState({
    refId: "",
    name: "",
    description: "",
    agestart: "",
    ageend: "",
    free_course: false,
    refFOSId_String: "",
  });

  useEffect(() => {
    if (open) {
      setCourse({
        refId: "",
        name: "",
        description: "",
        agestart: "",
        ageend: "",
        free_course: false,
        refFOSId_String: "",
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("authUser.token");
      const response = await axios.post(`${API_BASE_URL}/courses/courses`, course, {
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
        <TextField margin="dense" label="Course Name" type="text" fullWidth name="name" value={course.name} onChange={handleChange} />
        <TextField
          margin="dense"
          label="Course Description"
          type="text"
          fullWidth
          name="description"
          value={course.description}
          onChange={handleChange}
        />
        <TextField margin="dense" label="Min Age" type="number" fullWidth name="agestart" value={course.agestart} onChange={handleChange} />
        <TextField margin="dense" label="Max Age" type="number" fullWidth name="ageend" value={course.ageend} onChange={handleChange} />
        <FormControl fullWidth margin="dense">
          <InputLabel>Field of Study</InputLabel>
          <Select name="refFOSId_String" value={course.refFOSId_String} onChange={handleChange}>
            {fieldsOfStudy.map((field) => (
              <MenuItem key={field.refId} value={field.refId}>
                {field.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
