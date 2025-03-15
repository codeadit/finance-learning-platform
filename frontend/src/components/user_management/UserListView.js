import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserTypes } from "../../constants/UserTypes"; // Import user types
import { backgroundStyle } from "../../constants/styles";
import userService from "../../services/userService"; // Import user service
import { handleError } from "../../utils/HandleAxiosError";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UsersListView = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Add state for selected users
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Fetch user data from the backend
  const fetchUsers = async () => {
    const token = localStorage.getItem("authUser.token");
    try {
      const usersData = await userService.getUsers(token);
      setUsers(usersData);
    } catch (error) {
      handleError(error, navigate, "Error fetching users: ");
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserTypeChange = async (userId, newType) => {
    const token = localStorage.getItem("authUser.token");

    try {
      await userService.updateUserType(users, userId, newType, token);
      await fetchUsers();
    } catch (error) {
      handleError(error, navigate, "Error updating user type: ");
    }
  };

  const handleSelectUser = (userId) => {
    if (userId === undefined) {
      return;
    }

    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId) ? prevSelected.filter((id) => id !== userId) : [...prevSelected, userId]
    );
  };

  const handleDeleteUsers = async () => {
    const token = localStorage.getItem("authUser.token");

    try {
      const idtoDelete = selectedUsers.join(",");
      await userService.deleteUsers(idtoDelete, token);
      setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user.username)));
      setSelectedUsers([]); // Clear selected users after deletion
    } catch (error) {
      handleError(error, navigate, "Error deleting users: ");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={backgroundStyle} display="flex" flexDirection="column" alignItems="center">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Select</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>User Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>User Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created On</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Last Login</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Field Of Study</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Checkbox checked={selectedUsers.includes(user.username)} onChange={() => handleSelectUser(user.username)} />
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select value={user.userType} onChange={(e) => handleUserTypeChange(user.username, e.target.value)}>
                    {Object.values(UserTypes).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="contained" color="secondary" onClick={handleDeleteUsers} disabled={selectedUsers.length === 0}>
          Delete Selected Users
        </Button>
      </Box>
    </Box>
  );
};

export default UsersListView;
