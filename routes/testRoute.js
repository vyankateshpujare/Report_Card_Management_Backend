const express = require("express");
const { Test, validateTest } = require("../dataModel/testsModel");
const { Standard } = require("../dataModel/standardsModel");
const { Division } = require("../dataModel/divisionsModel");
const { Subject } = require("../dataModel/subjectsModel");
const { UserRole } = require("../dataModel/userRolesModel");
const router = express.Router();

router.get("/", async (req, res) => {
  const tests = await Test.find();
  if (!tests) {
    return res.status(404).send("tests not found");
  }
  res.status(200).send(tests);
});

router.get("/:id", async (req, res) => {
  const test = await Test.findById(req.params.id);
  if (!test) {
    return res.status(404).send("test not found");
  }
  res.status(200).send(test);
});

router.post("/alltests", async (req, res) => {
  const userRoles = await UserRole.find();
  const user = userRoles.find((ur) => ur.user._id == req.body.userId);
  let query1 = {};
  let query2 = {};
  let query3 = {};
  let query4 = {};

  query1["standard.standard"] = user.standard.standard;
  query2["division.division"] = user.division.division;

  if (user.role.role == "SubjectTeacher") {
    query3["subject.subject"] = user.subject.subject;
  }
  if (req.body.testName) {
    if (req.body.testName == "All") {
      query4 = {};
    } else {
      query4["testName"] = req.body.testName;
    }
  }
  const tests = await Test.find({ $and: [query1, query2, query3, query4] });
  if (!tests) {
    return res.status(404).send("tests not found");
  }
  res.status(200).send(tests);
});

router.post("/:userId", async (req, res) => {
  const { error } = validateTest(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const userRoles = await UserRole.find();
  const user = userRoles.find((ur) => ur.user._id == req.params.userId);

  const test = new Test({
    testName: req.body.testName,
    totalMarks: req.body.totalMarks,
    subject: user.subject,
    standard: user.standard,
    division: {
      _id: user.division._id,
      division: user.division.division,
    },
    year: req.body.year,
    // highestMarks: req.body.highestMarks,
    // averageMarks: req.body.averageMarks,
  });
  await test.save();
  res.status(200).send(test);
});

router.patch("/:id", async (req, res) => {
  const { error } = validateTest(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const test = await Test.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        testName: req.body.testName,
        totalMarks: req.body.totalMarks,
        year: req.body.year,
      },
    },
    { new: true, runValidators: true }
  );

  res.status(200).send(test);
});

router.delete("/:id", async (req, res) => {
  const test = await Test.findByIdAndDelete(req.params.id);
  if (!test) {
    return res.status(404).send("test not found");
  }

  res.status(200).send(test);
});
module.exports = router;
