import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CourseDialog from "./CourseDialog";
import QuestionBankDialog from "./QuestionBankDialog";
import QuestionDialog from "./QuestionDialog";
import SubTopicDialog from "./SubTopicDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const [coursesRes, subTopicsRes, questionBanksRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/courses`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_BASE_URL}/subtopics`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_BASE_URL}/questionbanks`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setCourses(coursesRes.data);
        setSubTopics(subTopicsRes.data);
        setQuestionBanks(questionBanksRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      case "questionBank":
        setQuestionBanks([...questionBanks, item]);
        break;
      case "question":
        setQuestions([...questions, item]);
        break;
      default:
        break;
    }
    handleCloseDialog();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <h2>Course Management</h2>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog("course")}>
        Create Course
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Course Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Course Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Min Age</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Max Age</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Free Course</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.courseid}>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>{course.course_description}</TableCell>
                <TableCell>{course.agestart}</TableCell>
                <TableCell>{course.ageend}</TableCell>
                <TableCell>{course.free_course ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog("subTopic")} sx={{ marginTop: 2 }}>
        Create Sub Topic
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Sub Topic Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Sub Topic Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Associated Course</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subTopics.map((subTopic) => (
              <TableRow key={subTopic.id}>
                <TableCell>{subTopic.name}</TableCell>
                <TableCell>{subTopic.description}</TableCell>
                <TableCell>{subTopic.course}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog("questionBank")} sx={{ marginTop: 2 }}>
        Create Question Bank
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Question Bank Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Question Bank Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Associated Course</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Associated Sub Topics</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionBanks.map((questionBank) => (
              <TableRow key={questionBank.id}>
                <TableCell>{questionBank.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog("question")} sx={{ marginTop: 2 }}>
        Create Question
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Question Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Options</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Answer</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Explanation</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Difficulty Level</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Associated Sub Topics</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Associated Courses</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Associated Question Banks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
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
      </TableContainer>

      <CourseDialog open={openDialog && dialogType === "course"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
      <SubTopicDialog open={openDialog && dialogType === "subTopic"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
      <QuestionBankDialog open={openDialog && dialogType === "questionBank"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
      <QuestionDialog
        open={openDialog && dialogType === "question"}
        onClose={handleCloseDialog}
        onCreate={handleCreateItem}
        courses={courses}
        subTopics={subTopics}
        questionBanks={questionBanks}
      />
    </Box>
  );
};

export default CourseManagement;
