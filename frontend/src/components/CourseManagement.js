import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CourseDialog from "./CourseDialog";
import QuestionDialog from "./QuestionDialog";
import QuestionSetDialog from "./QuestionSetDialog";
import SubTopicDialog from "./SubTopicDialog";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [subTopics, setSubTopics] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authUser.token");
      const [coursesRes, subTopicsRes, questionSetRes] = await Promise.all([
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
      ]);
      if (coursesRes.data !== undefined) {
        {
          setCourses(coursesRes.data);
        }
        if (subTopicsRes.data !== undefined) {
          setSubTopics(subTopicsRes.data);
        }
        if (questionSetRes.data !== undefined) {
          setQuestionSets(questionSetRes.data);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
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
      case "questionSet":
        setQuestionSets([...questionSets, item]);
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

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog("questionSet")} sx={{ marginTop: 2 }}>
        Create Question Set
      </Button>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Question Set Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Question Set Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Associated Course</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Associated Sub Topics</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questionSets.map((questionSet) => (
              <TableRow key={questionSet.id}>
                <TableCell>{questionSet.name}</TableCell>
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
              <TableCell sx={{ fontWeight: "bold" }}>Associated Question Sets</TableCell>
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
                <TableCell>{question.questionSets.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CourseDialog open={openDialog && dialogType === "course"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
      <SubTopicDialog open={openDialog && dialogType === "subTopic"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
      <QuestionSetDialog open={openDialog && dialogType === "questionSet"} onClose={handleCloseDialog} onCreate={handleCreateItem} />
      <QuestionDialog
        open={openDialog && dialogType === "question"}
        onClose={handleCloseDialog}
        onCreate={handleCreateItem}
        courses={courses}
        subTopics={subTopics}
        questionSets={questionSets}
      />
    </Box>
  );
};

export default CourseManagement;
