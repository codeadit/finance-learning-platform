import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";

const QuestionSetDialog = ({ open, onClose, onCreate }) => {
  const [questionSet, setQuestionSet] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionSet((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    onCreate(questionSet);
    onClose();
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
