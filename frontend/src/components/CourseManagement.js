import {
  Box,
  Button,
  Checkbox,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { backgroundStyle } from "../constants/styles";
import CourseDialog from "./CourseDialog";
import FieldOfStudyDialog from "./FieldofStudyDialog"; // Import the new dialog component
import QuestionDialog from "./QuestionDialog";
import QuestionSetDialog from "./QuestionSetDialog";
import SubTopicDialog from "./SubTopicDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [fieldsOfStudy, setFieldsOfStudy] = useState([]); // Add state for fields of study
  const [selectedItems, setSelectedItems] = useState([]); // Add state for selected items
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabIndex, setTabIndex] = useState(0); // Add state for tab index
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authUser.token");
      const [coursesRes, subTopicsRes, questionSetRes, fieldsOfStudyRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/courses/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${API_BASE_URL}/courses/subtopics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${API_BASE_URL}/courses/questionsets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${API_BASE_URL}/courses/fields_of_study`, {
          // Fetch fields of study
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
      if (coursesRes.data !== undefined) {
        setCourses(coursesRes.data);
      }
      if (subTopicsRes.data !== undefined) {
        setSubTopics(subTopicsRes.data);
      }
      if (questionSetRes.data !== undefined) {
        setQuestionSets(questionSetRes.data);
      }
      if (fieldsOfStudyRes.data !== undefined) {
        // Set fields of study state
        setFieldsOfStudy(fieldsOfStudyRes.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "warning",
          title: "Login Expired",
          text: "Your login session has expired. Please log in again.",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/login");
        });
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateItem = (item) => {
    switch (dialogType) {
      case "course":
        setCourses([...courses, item]);
        break;
      case "subTopic":
        setSubTopics([...subTopics, item]);
        break;
      case "questionSet":
        setQuestionSets([...questionSets, item]);
        break;
      case "question":
        setQuestions([...questions, item]);
        break;
      case "fieldOfStudy": // Add case for field of study
        setFieldsOfStudy([...fieldsOfStudy, item]);
        break;
      default:
        break;
    }
    // refresh the page so that the data is updated
    fetchData();
    handleCloseDialog();
  };

  const handleSelectItem = (id, type) => {
    setSelectedItems((prev) => {
      const isSelected = prev.find((item) => item.id === id && item.type === type);
      if (isSelected) {
        return prev.filter((item) => !(item.id === id && item.type === type));
      } else {
        return [...prev, { id, type }];
      }
    });
  };

  const handleDeleteSelected = async () => {
    try {
      const token = localStorage.getItem("authUser.token");
      await Promise.all(
        selectedItems.map((item) => {
          switch (item.type) {
            case "course":
              return axios.delete(`${API_BASE_URL}/courses/courses/${item.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            case "subTopic":
              return axios.delete(`${API_BASE_URL}/courses/subtopics/${item.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            case "questionSet":
              return axios.delete(`${API_BASE_URL}/courses/questionsets/${item.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            case "question":
              return axios.delete(`${API_BASE_URL}/courses/questions/${item.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            case "fieldOfStudy":
              return axios.delete(`${API_BASE_URL}/courses/fields_of_study/${item.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            default:
              return Promise.resolve();
          }
        })
      );
      fetchData();
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting items:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ ...backgroundStyle, display: "flex", flexDirection: "column", alignItems: "center", overflow: "auto", width: "100%" }}>
      <h2>Course Management</h2>
      <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Course Management Tabs">
        <Tab label="Fields of Study" />

        <Tab label="Courses" />
        <Tab label="Sub Topics" />
        <Tab label="Question Sets" />
        <Tab label="Questions" />
      </Tabs>
      {tabIndex === 0 && (
        <>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog("fieldOfStudy")} sx={{ marginTop: 2 }}>
            Create Field of Study
          </Button>

          <TableContainer component={Paper} sx={{ marginTop: 2, minWidth: 800, maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Field of Study Name</TableCell>
                  <TableCell>Field of Study Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fieldsOfStudy.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((field) => (
                  <TableRow key={field.fieldid}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.some((item) => item.id === field.fieldid && item.type === "fieldOfStudy")}
                        onChange={() => handleSelectItem(field.fieldid, "fieldOfStudy")}
                      />
                    </TableCell>
                    <TableCell>{field.field_name}</TableCell>
                    <TableCell>{field.field_description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={fieldsOfStudy.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteSelected}
            sx={{ margin: 2 }}
            disabled={selectedItems.filter((item) => item.type === "fieldOfStudy").length === 0}
          >
            Delete Selected
          </Button>
        </>
      )}
      {tabIndex === 1 && (
        <>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog("course")} sx={{ marginTop: 2 }}>
            Create Course
          </Button>

          <TableContainer component={Paper} sx={{ marginTop: 2, minWidth: 800, maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Course Description</TableCell>
                  <TableCell>Min Age</TableCell>
                  <TableCell>Max Age</TableCell>
                  <TableCell>Free Course</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => (
                  <TableRow key={course.courseid}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.some((item) => item.id === course.courseid && item.type === "course")}
                        onChange={() => handleSelectItem(course.courseid, "course")}
                      />
                    </TableCell>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>{course.course_description}</TableCell>
                    <TableCell>{course.agestart}</TableCell>
                    <TableCell>{course.ageend}</TableCell>
                    <TableCell>{course.free_course ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={courses.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteSelected}
            sx={{ margin: 2 }}
            disabled={selectedItems.filter((item) => item.type === "course").length === 0}
          >
            Delete Selected
          </Button>
        </>
      )}
      {tabIndex === 2 && (
        <>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog("subTopic")} sx={{ marginTop: 2 }}>
            Create Sub Topic
          </Button>

          <TableContainer component={Paper} sx={{ marginTop: 2, minWidth: 800, maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Sub Topic Name</TableCell>
                  <TableCell>Sub Topic Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subTopics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subTopic) => (
                  <TableRow key={subTopic.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.some((item) => item.id === subTopic.id && item.type === "subTopic")}
                        onChange={() => handleSelectItem(subTopic.id, "subTopic")}
                      />
                    </TableCell>
                    <TableCell>{subTopic.name}</TableCell>
                    <TableCell>{subTopic.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={subTopics.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteSelected}
            sx={{ margin: 2 }}
            disabled={selectedItems.filter((item) => item.type === "subTopic").length === 0}
          >
            Delete Selected
          </Button>
        </>
      )}
      {tabIndex === 3 && (
        <>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog("questionSet")} sx={{ marginTop: 2 }}>
            Create Question Set
          </Button>

          <TableContainer component={Paper} sx={{ marginTop: 2, minWidth: 800, maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Question Set Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Associated Course</TableCell>
                  <TableCell>Associated Sub Topics</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questionSets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((questionSet) => (
                  <TableRow key={questionSet.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.some((item) => item.id === questionSet.id && item.type === "questionSet")}
                        onChange={() => handleSelectItem(questionSet.id, "questionSet")}
                      />
                    </TableCell>
                    <TableCell>{questionSet.name}</TableCell>
                    <TableCell>{questionSet.description}</TableCell>
                    <TableCell>{questionSet.course}</TableCell>
                    <TableCell>{questionSet.subTopics.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={questionSets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteSelected}
            sx={{ margin: 2 }}
            disabled={selectedItems.filter((item) => item.type === "questionSet").length === 0}
          >
            Delete Selected
          </Button>
        </>
      )}
      {tabIndex === 4 && (
        <>
          <Button variant="contained" color="primary" onClick={() => handleOpenDialog("question")} sx={{ marginTop: 2 }}>
            Create Question
          </Button>

          <TableContainer component={Paper} sx={{ marginTop: 2, minWidth: 800, maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Question Name</TableCell>
                  <TableCell>Options</TableCell>
                  <TableCell>Answer</TableCell>
                  <TableCell>Explanation</TableCell>
                  <TableCell>Difficulty Level</TableCell>
                  <TableCell>Associated Sub Topics</TableCell>
                  <TableCell>Associated Courses</TableCell>
                  <TableCell>Associated Question Banks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.some((item) => item.id === question.id && item.type === "question")}
                        onChange={() => handleSelectItem(question.id, "question")}
                      />
                    </TableCell>
                    <TableCell>{question.name}</TableCell>
                    <TableCell>{question.options}</TableCell>
                    <TableCell>{question.correct_answer}</TableCell>
                    <TableCell>{question.explanation}</TableCell>
                    <TableCell>{question.difficulty}</TableCell>
                    <TableCell>{question.subTopics.join(", ")}</TableCell>
                    <TableCell>{question.courses.join(", ")}</TableCell>
                    <TableCell>{question.questionBanks.join(", ")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={questions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleDeleteSelected}
            sx={{ margin: 2 }}
            disabled={selectedItems.filter((item) => item.type === "question").length === 0}
          >
            Delete Selected
          </Button>
        </>
      )}

      <CourseDialog open={openDialog && dialogType === "course"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
      <SubTopicDialog open={openDialog && dialogType === "subTopic"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
      <QuestionSetDialog open={openDialog && dialogType === "questionSet"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
      <QuestionDialog
        open={openDialog && dialogType === "question"}
        onClose={handleCloseDialog}
        onCreate={handleCreateItem}
        courses={courses}
        subTopics={subTopics}
        questionBanks={questionSets}
      />
      <FieldOfStudyDialog open={openDialog && dialogType === "fieldOfStudy"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
    </Box>
  );
};

export default CourseManagement;
