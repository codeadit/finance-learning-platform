import {
  Box,
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
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import React, { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const QuestionDialog = ({ open, onClose, onCreate, courses, subTopics, questionBanks }) => {
  const [question, setQuestion] = useState({
    name: "",
    options: EditorState.createEmpty(),
    correct_answer: EditorState.createEmpty(),
    explanation: EditorState.createEmpty(),
    subTopics: [],
    courses: [],
    questionBanks: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (name, editorState) => {
    setQuestion((prev) => ({
      ...prev,
      [name]: editorState,
    }));
  };

  const handleCreate = async () => {
    const formattedQuestion = {
      ...question,
      options: question.options.getCurrentContent().getPlainText(),
      correct_answer: question.correct_answer.getCurrentContent().getPlainText(),
      explanation: question.explanation.getCurrentContent().getPlainText(),
    };
    try {
      const token = localStorage.getItem("authUser.token");
      const response = await axios.post(`${API_BASE_URL}/courses/questions`, formattedQuestion, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onCreate(response.data);
      onClose();
    } catch (error) {
      console.error("Error creating Question:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Question</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Question Name"
          type="text"
          fullWidth
          name="name"
          value={question.name}
          onChange={handleChange}
        />
        <InputLabel>Options</InputLabel>
        <FormControl fullWidth margin="dense">
          <Box border={1} borderColor="grey.400" borderRadius={4} p={1} minHeight={200}>
            <Editor editorState={question.options} onChange={(editorState) => handleEditorChange("options", editorState)} />
          </Box>
        </FormControl>
        <InputLabel>Correct Answer</InputLabel>
        <FormControl fullWidth margin="dense">
          <Box border={1} borderColor="grey.400" borderRadius={4} p={1} minHeight={200}>
            <Editor editorState={question.correct_answer} onChange={(editorState) => handleEditorChange("correct_answer", editorState)} />
          </Box>
        </FormControl>
        <InputLabel>Explanation</InputLabel>
        <FormControl fullWidth margin="dense">
          <Box border={1} borderColor="grey.400" borderRadius={4} p={1} minHeight={200}>
            <Editor editorState={question.explanation} onChange={(editorState) => handleEditorChange("explanation", editorState)} />
          </Box>
        </FormControl>
        <InputLabel>Difficulty Level</InputLabel>
        <FormControl fullWidth margin="dense">
          <Select name="difficulty" value={question.difficulty} onChange={handleChange}>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
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

export default QuestionDialog;
