import {
  Box,
  Button,
  Checkbox,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backgroundStyle } from "../../constants/styles";
import fieldsOfStudyService from "../../services/fieldsOfStudyService";
import { handleError } from "../../utils/HandleAxiosError";
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
  const [editingFOS, setEditingFOS] = useState(null);
  const [editedFOS, setEditedFOS] = useState({ name: "", description: "" });
  const [editingCourse, setEditingCourse] = useState(null);
  const [editedCourse, setEditedCourse] = useState({
    name: "",
    description: "",
    agestart: "",
    ageend: "",
    free_course: false,
    name: "",
  });
  const [editingSubTopic, setEditingSubTopic] = useState(null);
  const [editedSubTopic, setEditedSubTopic] = useState({ name: "", description: "", refCourseId: "" });
  const [editingQuestionSet, setEditingQuestionSet] = useState(null);
  const [editedQuestionSet, setEditedQuestionSet] = useState({ name: "", description: "", subTopics: [] });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({ name: "", options: "", correct_answer: "", explanation: "", difficulty: "" });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authUser.token");
      const [coursesRes, subTopicsRes, questionSetRes, fieldsOfStudyRes, questionsRes] = await Promise.all([
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
        fieldsOfStudyService.getFieldsOfStudy(token),
        axios.get(`${API_BASE_URL}/courses/questions`, {
          // Fetch fields of study
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
      if (coursesRes.data !== undefined) {
        console.log("courses", coursesRes.data);
        setCourses(coursesRes.data);
      }
      if (subTopicsRes.data !== undefined) {
        console.log("sub topics", subTopicsRes.data);
        setSubTopics(subTopicsRes.data);
      }
      if (questionSetRes.data !== undefined) {
        console.log("question sets", questionSetRes.data);
        setQuestionSets(questionSetRes.data);
      }
      if (fieldsOfStudyRes !== undefined) {
        // Set fields of study state
        console.log("fields of study", fieldsOfStudyRes);
        setFieldsOfStudy(fieldsOfStudyRes);
      }
      if (questionsRes.data !== undefined) {
        console.log("questions", questionsRes.data);
        setQuestions(questionsRes.data);
      }
    } catch (error) {
      handleError(error, navigate);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("sub topics", subTopics);
  }, []);

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEditFOS = (field) => {
    setEditingFOS(field.refId);
    setEditedFOS({ name: field.name, description: field.description, refId: field.refId });
  };

  const handleSaveFOS = async (fieldid) => {
    try {
      const token = localStorage.getItem("authUser.token");
      await fieldsOfStudyService.updateFieldOfStudy(fieldid, editedFOS, token);
      fetchData();
      setEditingFOS(null);
    } catch (error) {
      handleError(error, navigate, "Error updating field of study:");
    }
  };

  const handleCancelFOSEdit = () => {
    setEditingFOS(null);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course.refId);
    setEditedCourse({
      name: course.name,
      description: course.description,
      agestart: course.agestart,
      ageend: course.ageend,
      free_course: course.free_course,
      field_name: course.field_name,
      refId: course.refId,
      refFOSId_String: course.refFOSId_String,
    });
  };

  const handleSaveCourse = async (courseid) => {
    try {
      const token = localStorage.getItem("authUser.token");
      await axios.put(`${API_BASE_URL}/courses/courses/${courseid}`, editedCourse, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
      setEditingCourse(null);
    } catch (error) {
      handleError(error, navigate, "Error updating course:");
    }
  };

  const handleCancelCourseEdit = () => {
    setEditingCourse(null);
  };

  const handleEditSubTopic = (subTopic) => {
    setEditingSubTopic(subTopic.refId);
    setEditedSubTopic({
      name: subTopic.name,
      description: subTopic.description,
      refCourseId: subTopic.refCourseId,
    });
  };

  const handleSaveSubTopic = async (subtopicid) => {
    try {
      const token = localStorage.getItem("authUser.token");
      await axios.put(`${API_BASE_URL}/courses/subtopics/${subtopicid}`, editedSubTopic, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
      setEditingSubTopic(null);
    } catch (error) {
      handleError(error, navigate, "Error updating sub topic:");
    }
  };

  const handleCancelSubTopicEdit = () => {
    setEditingSubTopic(null);
  };

  const handleEditQuestionSet = (questionSet) => {
    setEditingQuestionSet(questionSet.refId);
    setEditedQuestionSet({
      name: questionSet.name,
      description: questionSet.description,
      subTopic: questionSet.subTopic,
      questions: questionSet.questions || [], // Ensure the value is an array
      refSubTopicId: questionSet.refSubTopicId,
      refQuestionIds: questionSet.refQuestionIds,
    });
  };

  const handleSaveQuestionSet = async (id) => {
    try {
      const token = localStorage.getItem("authUser.token");
      await axios.put(`${API_BASE_URL}/courses/questionsets/${id}`, editedQuestionSet, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
      setEditingQuestionSet(null);
    } catch (error) {
      handleError(error, navigate, "Error updating question set:");
    }
  };

  const handleCancelQuestionSetEdit = () => {
    setEditingQuestionSet(null);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question.refId);
    setEditedQuestion({
      question_text: question.question_text,
      options: question.options,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      difficulty: question.difficulty,
    });
  };

  const handleSaveQuestion = async (id) => {
    try {
      const token = localStorage.getItem("authUser.token");
      await axios.put(`${API_BASE_URL}/courses/questions/${id}`, editedQuestion, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
      setEditingQuestion(null);
    } catch (error) {
      handleError(error, navigate, "Error updating question:");
    }
  };

  const handleCancelQuestionEdit = () => {
    setEditingQuestion(null);
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

  const handleDeleteSelected = async (type) => {
    try {
      const token = localStorage.getItem("authUser.token");
      const ids = selectedItems
        .filter((item) => item.type === type)
        .map((item) => item.id)
        .join(",");

      if (!ids) return;

      switch (type) {
        case "course":
          await axios.delete(`${API_BASE_URL}/courses/courses`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { ids },
          });
          break;
        case "subTopic":
          await axios.delete(`${API_BASE_URL}/courses/subtopics`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { ids },
          });
          break;
        case "questionSet":
          await axios.delete(`${API_BASE_URL}/courses/questionsets`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { ids },
          });
          break;
        case "question":
          await axios.delete(`${API_BASE_URL}/courses/questions`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { ids },
          });
          break;
        case "fieldOfStudy":
          await fieldsOfStudyService.deleteFieldsOfStudy(ids, token);
          break;
        default:
          break;
      }

      fetchData();
      setSelectedItems([]);
    } catch (error) {
      handleError(error, navigate, "Error deleting items:");
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
                  <TableCell sx={{ fontWeight: "bold" }}>Select</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Field of Study Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Field of Study Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fieldsOfStudy.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((field, index) => {
                  if (!field) {
                    console.error(`Undefined field at index ${index}`);
                    return null;
                  }
                  return (
                    <TableRow key={field.refId}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.some((item) => item.id === field.refId && item.type === "fieldOfStudy")}
                          onChange={() => handleSelectItem(field.refId, "fieldOfStudy")}
                        />
                      </TableCell>
                      <TableCell>
                        {editingFOS === field.refId ? (
                          <TextField value={editedFOS.name} onChange={(e) => setEditedFOS({ ...editedFOS, name: e.target.value })} />
                        ) : (
                          field.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFOS === field.refId ? (
                          <TextField
                            value={editedFOS.description}
                            onChange={(e) => setEditedFOS({ ...editedFOS, description: e.target.value })}
                          />
                        ) : (
                          field.description
                        )}
                      </TableCell>
                      <TableCell>
                        {editingFOS === field.refId ? (
                          <>
                            <Button onClick={() => handleSaveFOS(field.refId)}>Save</Button>
                            <Button onClick={handleCancelFOSEdit}>Cancel</Button>
                          </>
                        ) : (
                          <Button onClick={() => handleEditFOS(field)}>Edit</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            onClick={() => handleDeleteSelected("fieldOfStudy")}
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
                  <TableCell sx={{ fontWeight: "bold" }}>Select</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Course Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Course Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Min Age</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Max Age</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Free Course</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Associated Topic of Study</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course) => (
                  <TableRow key={course.refId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.some((item) => item.id === course.refId && item.type === "course")}
                        onChange={() => handleSelectItem(course.refId, "course")}
                      />
                    </TableCell>
                    <TableCell>
                      {editingCourse === course.refId ? (
                        <TextField value={editedCourse.name} onChange={(e) => setEditedCourse({ ...editedCourse, name: e.target.value })} />
                      ) : (
                        course.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCourse === course.refId ? (
                        <TextField
                          value={editedCourse.description}
                          onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
                        />
                      ) : (
                        course.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCourse === course.refId ? (
                        <TextField
                          value={editedCourse.agestart}
                          onChange={(e) => setEditedCourse({ ...editedCourse, agestart: e.target.value })}
                        />
                      ) : (
                        course.agestart
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCourse === course.refId ? (
                        <TextField
                          value={editedCourse.ageend}
                          onChange={(e) => setEditedCourse({ ...editedCourse, ageend: e.target.value })}
                        />
                      ) : (
                        course.ageend
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCourse === course.refId ? (
                        <Checkbox
                          checked={editedCourse.free_course}
                          onChange={(e) => setEditedCourse({ ...editedCourse, free_course: e.target.checked })}
                        />
                      ) : course.free_course ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCourse === course.refId ? (
                        <Select
                          value={editedCourse.refFOSId_String}
                          onChange={(e) => setEditedCourse({ ...editedCourse, refFOSId_String: e.target.value })}
                          fullWidth
                        >
                          {fieldsOfStudy.map((field) => (
                            <MenuItem key={field.refId} value={field.refId}>
                              {field.name}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        fieldsOfStudy.find((field) => field.refId === course.refFOSId_String)?.name || ""
                      )}
                    </TableCell>
                    <TableCell>
                      {editingCourse === course.refId ? (
                        <>
                          <Button onClick={() => handleSaveCourse(course.refId)}>Save</Button>
                          <Button onClick={handleCancelCourseEdit}>Cancel</Button>
                        </>
                      ) : (
                        <Button onClick={() => handleEditCourse(course)}>Edit</Button>
                      )}
                    </TableCell>
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
            onClick={() => handleDeleteSelected("course")}
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
                  <TableCell sx={{ fontWeight: "bold" }}>Select</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Sub Topic Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Sub Topic Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Associated Course</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subTopics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((subTopic) => (
                  <TableRow key={subTopic.refId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.some((item) => item.id === subTopic.refId && item.type === "subTopic")}
                        onChange={() => handleSelectItem(subTopic.refId, "subTopic")}
                      />
                    </TableCell>
                    <TableCell>
                      {editingSubTopic === subTopic.refId ? (
                        <TextField
                          value={editedSubTopic.name}
                          onChange={(e) => setEditedSubTopic({ ...editedSubTopic, name: e.target.value })}
                        />
                      ) : (
                        subTopic.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSubTopic === subTopic.refId ? (
                        <TextField
                          value={editedSubTopic.description}
                          onChange={(e) => setEditedSubTopic({ ...editedSubTopic, description: e.target.value })}
                        />
                      ) : (
                        subTopic.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSubTopic === subTopic.refId ? (
                        <Select
                          value={editedSubTopic.refCourseId}
                          onChange={(e) => setEditedSubTopic({ ...editedSubTopic, refCourseId: e.target.value })}
                          fullWidth
                        >
                          {courses.map((course) => (
                            <MenuItem key={course.refId} value={course.refId}>
                              {course.name}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        courses.find((course) => course.refId === subTopic.refCourseId)?.name || ""
                      )}
                    </TableCell>
                    <TableCell>
                      {editingSubTopic === subTopic.refId ? (
                        <>
                          <Button onClick={() => handleSaveSubTopic(subTopic.refId)}>Save</Button>
                          <Button onClick={handleCancelSubTopicEdit}>Cancel</Button>
                        </>
                      ) : (
                        <Button onClick={() => handleEditSubTopic(subTopic)}>Edit</Button>
                      )}
                    </TableCell>
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
            onClick={() => handleDeleteSelected("subTopic")}
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
                  <TableCell sx={{ fontWeight: "bold" }}>Select</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Question Set Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Associated Sub Topics</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Questions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questionSets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((questionSet) => (
                  <TableRow key={questionSet.refId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.some((item) => item.id === questionSet.refId && item.type === "questionSet")}
                        onChange={() => handleSelectItem(questionSet.refId, "questionSet")}
                      />
                    </TableCell>
                    <TableCell>
                      {editingQuestionSet === questionSet.refId ? (
                        <TextField
                          value={editedQuestionSet.name}
                          onChange={(e) => setEditedQuestionSet({ ...editedQuestionSet, name: e.target.value })}
                        />
                      ) : (
                        questionSet.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingQuestionSet === questionSet.refId ? (
                        <TextField
                          value={editedQuestionSet.description}
                          onChange={(e) => setEditedQuestionSet({ ...editedQuestionSet, description: e.target.value })}
                        />
                      ) : (
                        questionSet.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingQuestionSet === questionSet.refId ? (
                        <Select
                          value={editedQuestionSet.subTopic}
                          onChange={(e) => setEditedQuestionSet({ ...editedQuestionSet, subTopic: e.target.value })}
                          fullWidth
                        >
                          {subTopics.map((subTopic) => (
                            <MenuItem key={subTopic.refId} value={subTopic.refId}>
                              {subTopic.name}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        subTopics.find((subTopic) => subTopic.refId === questionSet.subTopic)?.name || ""
                      )}
                    </TableCell>

                    <TableCell>
                      {editingQuestionSet === questionSet.refId ? (
                        <Select
                          value={editedQuestionSet.questions || []} // Ensure the value is an array
                          onChange={(e) => setEditedQuestionSet({ ...editedQuestionSet, questions: e.target.value })}
                          multiple
                          fullWidth
                        >
                          {Array.isArray(questions) && questions.length > 0 ? (
                            questions.map((question) => (
                              <MenuItem key={question.refId} value={question.refId}>
                                <Checkbox checked={editedQuestionSet.questions.indexOf(question.refId) > -1} />
                                <ListItemText primary={question.question_text} />
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No questions available</MenuItem>
                          )}
                        </Select>
                      ) : Array.isArray(questionSet.questions) && questionSet.questions.length > 0 ? (
                        questionSet.questions
                          .map((questionId) => {
                            const question = questions.find((q) => q.refId === questionId);
                            return question ? question.question_text : "Unknown question";
                          })
                          .join(", ")
                      ) : (
                        "No questions available"
                      )}
                    </TableCell>

                    <TableCell>
                      {editingQuestionSet === questionSet.refId ? (
                        <>
                          <Button onClick={() => handleSaveQuestionSet(questionSet.refId)}>Save</Button>
                          <Button onClick={handleCancelQuestionSetEdit}>Cancel</Button>
                        </>
                      ) : (
                        <Button onClick={() => handleEditQuestionSet(questionSet)}>Edit</Button>
                      )}
                    </TableCell>
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
            onClick={() => handleDeleteSelected("questionSet")}
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
                  <TableCell sx={{ fontWeight: "bold" }}>Select</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Question Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Options</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Answer</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Explanation</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Difficulty Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((question) => (
                  <TableRow key={question.refId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.some((item) => item.id === question.refId && item.type === "question")}
                        onChange={() => handleSelectItem(question.refId, "question")}
                      />
                    </TableCell>
                    <TableCell>
                      {editingQuestion === question.refId ? (
                        <TextField
                          value={editedQuestion.question_text}
                          onChange={(e) => setEditedQuestion({ ...editedQuestion, name: e.target.value })}
                        />
                      ) : (
                        question.question_text
                      )}
                    </TableCell>
                    <TableCell>
                      {editingQuestion === question.refId ? (
                        <TextField
                          value={editedQuestion.options}
                          onChange={(e) => setEditedQuestion({ ...editedQuestion, options: e.target.value })}
                        />
                      ) : (
                        question.options
                      )}
                    </TableCell>
                    <TableCell>
                      {editingQuestion === question.refId ? (
                        <TextField
                          value={editedQuestion.correct_answer}
                          onChange={(e) => setEditedQuestion({ ...editedQuestion, correct_answer: e.target.value })}
                        />
                      ) : (
                        question.correct_answer
                      )}
                    </TableCell>
                    <TableCell>
                      {editingQuestion === question.refId ? (
                        <TextField
                          value={editedQuestion.explanation}
                          onChange={(e) => setEditedQuestion({ ...editedQuestion, explanation: e.target.value })}
                        />
                      ) : (
                        question.explanation
                      )}
                    </TableCell>
                    <TableCell>
                      {editingQuestion === question.refId ? (
                        <Select
                          value={editedQuestion.difficulty}
                          onChange={(e) => setEditedQuestion({ ...editedQuestion, difficulty: e.target.value })}
                          fullWidth
                        >
                          <MenuItem value="Easy">Easy</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="Hard">Hard</MenuItem>
                        </Select>
                      ) : (
                        question.difficulty
                      )}
                    </TableCell>
                    <TableCell>
                      {editingQuestion === question.refId ? (
                        <>
                          <Button onClick={() => handleSaveQuestion(question.refId)}>Save</Button>
                          <Button onClick={handleCancelQuestionEdit}>Cancel</Button>
                        </>
                      ) : (
                        <Button onClick={() => handleEditQuestion(question)}>Edit</Button>
                      )}
                    </TableCell>
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
            onClick={() => handleDeleteSelected("question")}
            sx={{ margin: 2 }}
            disabled={selectedItems.filter((item) => item.type === "question").length === 0}
          >
            Delete Selected
          </Button>
        </>
      )}

      <CourseDialog
        open={openDialog && dialogType === "course"}
        onClose={handleCloseDialog}
        onCreate={handleCreateItem}
        fieldsOfStudy={fieldsOfStudy}
      />
      <SubTopicDialog
        open={openDialog && dialogType === "subTopic"}
        onClose={handleCloseDialog}
        onCreate={handleCreateItem}
        courses={courses}
      />
      <QuestionSetDialog
        open={openDialog && dialogType === "questionSet"}
        onClose={handleCloseDialog}
        onCreate={handleCreateItem}
        subTopics={subTopics}
      />
      <QuestionDialog open={openDialog && dialogType === "question"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
      <FieldOfStudyDialog open={openDialog && dialogType === "fieldOfStudy"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
    </Box>
  );
};

export default CourseManagement;
