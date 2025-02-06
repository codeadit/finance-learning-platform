import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";

const QuestionBankDialog = ({ open, onClose, onCreate }) => {
  const [questionBank, setQuestionBank] = useState({
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionBank((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    onCreate(questionBank);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Question Bank</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Question Bank Name"
          type="text"
          fullWidth
          name="name"
          value={questionBank.name}
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

export default QuestionBankDialog;
