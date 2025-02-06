import { Box, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { convertBackendToFrontendUserType, convertFrontEndToBackendUserType, UserTypes } from "../constants/UserTypes"; // Import user types
import { backgroundStyle } from "../constants/styles";

const UsersListView = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authUser.token");
        await axios
          .get("http://localhost:5005/user/users", {
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
          })
          .catch((res) => {
            console.error("Error fetching users:", res);
          }); // need to wait till the data is fetched
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserTypeChange = async (userId, newType) => {
    try {
      const token = localStorage.getItem("authUser.token");
      const user = users.find((user) => user.username === userId);
      const backendType = convertFrontEndToBackendUserType(newType);
      await axios.put(
        `http://localhost:5005/user/usertype`,
        { email: user.email, userType: backendType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers((prevUsers) => prevUsers.map((user) => (user._id === userId ? { ...user, userType: newType } : user)));
    } catch (error) {
      console.error("Error updating user type:", error);
    }
  };

  return (
    <Box sx={backgroundStyle}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
    </Box>
  );
};

export default UsersListView;
