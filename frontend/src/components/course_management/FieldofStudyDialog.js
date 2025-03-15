import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import fieldsOfStudyService from "../../services/fieldsOfStudyService";

const FieldofStudyDialog = ({ open, onClose, onCreate }) => {
  const [field, setField] = useState({
    field_name: "",
    field_description: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("authUser.token");
      const response = await fieldsOfStudyService.createFieldOfStudy(field, token);
      onCreate(response.data);
      onClose();
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.error === "Field of Study already exists") {
        setError("Field of Study already exists");
      } else {
        console.error("Error creating field of study:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Field of Study</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Field Name"
          type="text"
          fullWidth
          name="field_name"
          value={field.field_name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Field Description"
          type="text"
          fullWidth
          name="field_description"
          value={field.field_description}
          onChange={handleChange}
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
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

export default FieldofStudyDialog;
