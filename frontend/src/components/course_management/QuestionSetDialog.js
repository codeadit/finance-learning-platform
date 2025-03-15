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

const QuestionSetDialog = ({ open, onClose, onCreate, subTopics }) => {
  const [questionSet, setQuestionSet] = useState({
    name: "",
    description: "",
    subtopicid: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionSet((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("authUser.token");
      const response = await axios.post(`${API_BASE_URL}/courses/questionSets`, questionSet, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onCreate(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating Question Sets:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Question Set</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Question Set Name"
          type="text"
          fullWidth
          name="name"
          value={questionSet.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Question Set Description"
          type="text"
          fullWidth
          name="description"
          value={questionSet.description}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Sub Topic</InputLabel>
          <Select value={questionSet.subtopicid} onChange={handleChange} name="subtopicid">
            {subTopics.map((subTopic) => (
              <MenuItem key={subTopic.subtopicid} value={subTopic.subtopicid}>
                {subTopic.subtopic_name}
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

export default QuestionSetDialog;
