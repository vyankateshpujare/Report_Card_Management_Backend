const express = require("express");
const users = require("../routes/userRoute");
const divisions = require("../routes/divisionRoute");
const standards = require("../routes/standardRoute");
const subjects = require("../routes/subjectRoute");
const roles = require("../routes/roleRoute");
const students = require("../routes/studentRoute");
const userRoles = require("../routes/userRoleRoute");
const tests = require("../routes/testRoute");
const studentTestResults = require("../routes/studentTestResultRoute");
const grades = require("../routes/gradeRoute");
const reports = require("../routes/reportRoute");
const login = require("../routes/loginRoute");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/divisions", divisions);
  app.use("/api/standards", standards);
  app.use("/api/subjects", subjects);
  app.use("/api/roles", roles);
  app.use("/api/students", students);
  app.use("/api/userroles", userRoles);
  app.use("/api/tests", tests);
  app.use("/api/testresults", studentTestResults);
  app.use("/api/grades", grades);
  app.use("/api/reports", reports);
  app.use("/api/login", login);
};
