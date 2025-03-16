import axios from "axios";
import { convertBackendToFrontendUserType, convertFrontEndToBackendUserType } from "../constants/UserTypes";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getUsers = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/user/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Process the data to convert backend user type to frontend user type
  const users = response.data.map((user) => {
    user.userType = convertBackendToFrontendUserType(user.userType);
    return user;
  });

  return users;
};

const updateUserType = async (users, userId, newType, token) => {
  const user = users.find((user) => user.username === userId);
  const backendType = convertFrontEndToBackendUserType(newType);
  const response = await axios.put(
    `${API_BASE_URL}/user/usertype`,
    { email: user.email, userType: backendType },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const updateFOS = async (users, userId, newFOS, token) => {
  const user = users.find((user) => user.username === userId);
  const response = await axios.put(
    `${API_BASE_URL}/user/userFOS`,
    { email: user.email, fos: newFOS },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const deleteUsers = async (userIds, token) => {
  const response = await axios.delete(`${API_BASE_URL}/user/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { userIds },
  });
  return response.data;
};

const loginUser = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/user/login`, formData);
  return response.data;
};

const registerUser = async (formData) => {
  const response = await axios.post(`${API_BASE_URL}/user/register`, formData);
  return response.data;
};

export default {
  getUsers,
  updateUserType,
  updateFOS,
  deleteUsers,
  loginUser,
  registerUser,
};
