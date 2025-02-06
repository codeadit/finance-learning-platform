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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { convertBackendToFrontendUserType, convertFrontEndToBackendUserType, UserTypes } from "../constants/UserTypes"; // Import user types
import { backgroundStyle } from "../constants/styles";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const UsersListView = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Add state for selected users
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch user data from the backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authUser.token");
      await axios
        .get(`${API_BASE_URL}/user/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // need to convert backend user type to frontend user type
          res.data.forEach((user) => {
            console.log("user", user);
            console.log("user.userType", user.userType);
            user.userType = convertBackendToFrontendUserType(user.userType);
          });

          setUsers(res.data);
          setLoading(false); // Set loading to false after data is fetched
        })
        .catch((res) => {
          console.error("Error fetching users:", res);
          setLoading(false); // Set loading to false after data is fetched
        }); // need to wait till the data is fetched
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserTypeChange = async (userId, newType) => {
    try {
      const token = localStorage.getItem("authUser.token");
      const user = users.find((user) => user.username === userId);
      const backendType = convertFrontEndToBackendUserType(newType);
      await axios.put(
        `${API_BASE_URL}/user/usertype`,
        { email: user.email, userType: backendType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUsers();
    } catch (error) {
      console.error("Error updating user type:", error);
    }
  };

  const handleSelectUser = (userId) => {
    if (userId === undefined) {
      return;
    }

    console.log("userId", userId);
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId) ? prevSelected.filter((id) => id !== userId) : [...prevSelected, userId]
    );
    console.log("selectedUsers", selectedUsers);
  };

  const handleDeleteUsers = async () => {
    console.log("selectedUsers", selectedUsers);
    try {
      const token = localStorage.getItem("authUser.token");
      // make a comma separated string of selected users
      const idtoDelete = selectedUsers.join(",");
      console.log("idtoDelete", idtoDelete);
      await axios.delete(`${API_BASE_URL}/user/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userIds: idtoDelete },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user.username)));
      setSelectedUsers([]); // Clear selected users after deletion
    } catch (error) {
      console.error("Error deleting users:", error);
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
