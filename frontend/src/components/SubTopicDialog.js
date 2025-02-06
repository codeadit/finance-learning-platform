import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";

const SubTopicDialog = ({ open, onClose, onCreate }) => {
  const [subTopic, setSubTopic] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubTopic((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = () => {
    onCreate(subTopic);
    onClose();
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
