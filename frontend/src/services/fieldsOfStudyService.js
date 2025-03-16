import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getFieldsOfStudy = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/courses/fields_of_study`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateFieldOfStudy = async (refId, editedFOS, token) => {
  const response = await axios.put(`${API_BASE_URL}/courses/fields_of_study/${refId}`, editedFOS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteFieldsOfStudy = async (ids, token) => {
  const response = await axios.delete(`${API_BASE_URL}/courses/fields_of_study`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { ids },
  });
  return response.data;
};

const createFieldOfStudy = async (field, token) => {
  const response = await axios.post(`${API_BASE_URL}/courses/fields_of_study`, field, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  getFieldsOfStudy,
  updateFieldOfStudy,
  deleteFieldsOfStudy,
  createFieldOfStudy,
};
