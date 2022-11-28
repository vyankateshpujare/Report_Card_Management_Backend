const express = require("express");
const router = express.Router();
const {
  StudentTestResult,
  validateTestResult,
} = require("../dataModel/studentTestResultModel");
const { Test } = require("../dataModel/testsModel");
const { Student } = require("../dataModel/studentsModel");
const { UserRole } = require("../dataModel/userRolesModel");

router.get("/", async (req, res) => {
  const testResults = await StudentTestResult.find();
  if (!testResults) {
    return res.status(404).send("test results not found");
  }
  res.status(200).send(testResults);
});

router.post("/allresults", async (req, res) => {
  const userRoles = await UserRole.find();
  const subjectTeacher = userRoles.find((ur) => ur.user._id == req.body.userId);
  let query1 = {};
  let query2 = {};
  let query3 = {};
  let query4 = {};
  query1["test.standard.standard"] = subjectTeacher.standard.standard;
  query2["test.division.division"] = subjectTeacher.division.division;
  query3["test.subject.subject"] = subjectTeacher.subject.subject;

  if (req.body.student) {
    query4["student.firstName"] = req.body.student;
  }
  const testResults = await StudentTestResult.find({
    $and: [query1, query2, query3, query4],
  });
  if (!testResults) {
    return res.status(404).send("test results not found");
  }
  res.status(200).send(testResults);
});

router.post("/", async (req, res) => {
  const { error } = validateTestResult(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const student = await Student.findById(req.body.student);
  if (!student) {
    return res.status(404).send("student not found");
  }

  const test = await Test.findById(req.body.test);
  if (!test) {
    return res.status(404).send("test not found");
  }

  const testResult = new StudentTestResult({
    student: student,
    test: test,
    obtainedMarks: req.body.obtainedMarks,
    // obtainedGrade:req.body.gradeId
  });
  await testResult.save();
  res.status(200).send(testResult);
});

router.put("/:id", async (req, res) => {
  const { error } = validateTestResult(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const student = await Student.findById(req.body.studentId);
  if (!student) {
    return res.status(404).send("student not found");
  }

  const test = await Test.findById(req.body.testId);
  if (!test) {
    return res.status(404).send("test not found");
  }

  const testResult = await StudentTestResult.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        student: req.body.studentId,
        test: req.body.testId,
        obtainedMarks: req.body.obtainedMarks,
      },
    },
    { new: true, runValidators: true }
  );

  if (!testResult) {
    return res.status(404).send("test result not found");
  }

  res.status(200).send(testResult);
});

router.delete("/:id", async (req, res) => {
  const testResult = await StudentTestResult.findByIdAndDelete(req.params.id);
  if (!testResult) {
    return res.status(404).send("test result not found");
  }

  res.status(200).send(testResult);
});

module.exports = router;
