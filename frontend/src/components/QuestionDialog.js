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
import { Editor, EditorState, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import React, { useState } from "react";

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

  const handleCreate = () => {
    const formattedQuestion = {
      ...question,
      options: JSON.stringify(convertToRaw(question.options.getCurrentContent())),
      correct_answer: JSON.stringify(convertToRaw(question.correct_answer.getCurrentContent())),
      explanation: JSON.stringify(convertToRaw(question.explanation.getCurrentContent())),
    };
    onCreate(formattedQuestion);
    onClose();
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
        <FormControl fullWidth margin="dense">
          <InputLabel>Options</InputLabel>
          <Box border={1} borderColor="grey.400" borderRadius={4} p={1} minHeight={200}>
            <Editor editorState={question.options} onChange={(editorState) => handleEditorChange("options", editorState)} />
          </Box>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Correct Answer</InputLabel>
          <Box border={1} borderColor="grey.400" borderRadius={4} p={1} minHeight={200}>
            <Editor editorState={question.correct_answer} onChange={(editorState) => handleEditorChange("correct_answer", editorState)} />
          </Box>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Explanation</InputLabel>
          <Box border={1} borderColor="grey.400" borderRadius={4} p={1} minHeight={200}>
            <Editor editorState={question.explanation} onChange={(editorState) => handleEditorChange("explanation", editorState)} />
          </Box>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Difficulty Level</InputLabel>
          <Select name="difficulty" value={question.difficulty} onChange={handleChange}>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Associated Sub Topics</InputLabel>
          <Select multiple name="subTopics" value={question.subTopics} onChange={handleChange}>
            {subTopics.map((subTopic) => (
              <MenuItem key={subTopic.id} value={subTopic.name}>
                {subTopic.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Associated Courses</InputLabel>
          <Select multiple name="courses" value={question.courses} onChange={handleChange}>
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.name}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Associated Question Banks</InputLabel>
          <Select multiple name="questionBanks" value={question.questionBanks} onChange={handleChange}>
            {questionBanks.map((questionBank) => (
              <MenuItem key={questionBank.id} value={questionBank.name}>
                {questionBank.name}
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

export default QuestionDialog;
