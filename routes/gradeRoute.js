const express = require("express");
const { Grade, validateGrade } = require("../dataModel/gradesModel");
const router = express.Router();

router.get("/", async (req, res) => {
  const grades = await Grade.find();
  if (!grades) {
    return res.status(404).send("grades not found");
  }
  res.status(200).send(grades);
});

router.get("/:id", async (req, res) => {
  const grade = await Grade.findById(req.params.id);
  if (!grade) {
    return res.status(404).send("grade not found");
  }
  res.status(200).send(grade);
});

router.post("/countgrades", async (req, res) => {
  const { grade, minMarks, maxMarks } = req.body;
  let query = {};
  if (grade) {
    query["grade"] = grade;
  }
  if (minMarks) {
    query["start"] = minMarks;
  }
  if (maxMarks) {
    query["end"] = maxMarks;
  }
  const totalNoOfGrades = await Grade.find(query).count();
  console.log(totalNoOfGrades);
  return res.status(200).send(totalNoOfGrades + "");
});

router.post("/pfs", async (req, res) => {
  const { grade, minMarks, maxMarks, pageSize, currentPage } = req.body;
  let query = {};
  if (grade) {
    query["grade"] = grade;
  }
  if (minMarks) {
    query["start"] = minMarks;
  }
  if (maxMarks) {
    query["end"] = maxMarks;
  }

  const skip = (currentPage - 1) * pageSize;
  const limit = pageSize;

  const grades = await Grade.find(query).limit(limit).skip(skip);
  if (!grades) {
    return res.status(404).send("grades not found");
  }
  res.status(200).send(grades);
});

router.post("/", async (req, res) => {
  const { error } = validateGrade(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let grade = await Grade.findOne({ grade: req.body.grade });
  if (grade) {
    return res.status(400).send("Grade is Already Present");
  }

  grade = new Grade({
    grade: req.body.grade,
    start: req.body.start,
    end: req.body.end,
  });

  await grade.save();
  res.status(200).send(grade);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGrade(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const grade = await Grade.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        grade: req.body.grade,
        start: req.body.start,
        end: req.body.end,
      },
    },
    { new: true, runValidators: true }
  );
  if (!grade) {
    return res.status(404).send("grade not found");
  }
  res.status(200).send(grade);
});

router.delete("/:id", async (req, res) => {
  const grade = await Grade.findByIdAndDelete(req.params.id);
  if (!grade) {
    return res.status(404).send("grade not found");
  }
  res.status(200).send(grade);
});

module.exports = router;
