import {
  Button,
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
import React, { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SubTopicDialog = ({ open, onClose, onCreate, courses }) => {
  const [subTopic, setSubTopic] = useState({
    name: "",
    description: "",
    refCourseId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubTopic((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("authUser.token");
      const response = await axios.post(`${API_BASE_URL}/courses/subtopics`, subTopic, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onCreate(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating Sub Topic:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Sub Topic</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Sub Topic Name"
          type="text"
          fullWidth
          name="name"
          value={subTopic.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Sub Topic Description"
          type="text"
          fullWidth
          name="description"
          value={subTopic.description}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Course</InputLabel>
          <Select name="refCourseId" value={subTopic.refCourseId} onChange={handleChange}>
            {courses.map((course) => (
              <MenuItem key={course.refId} value={course.refId}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default SubTopicDialog;
