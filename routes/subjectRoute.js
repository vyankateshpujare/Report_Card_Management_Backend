const express = require("express");
const { Subject, validateSubject } = require("../dataModel/subjectsModel");
const router = express.Router();

router.get("/", async (req, res) => {
  const subjects = await Subject.find();
  if (!subjects) {
    return res.status(404).send("subjects not found");
  }
  res.status(200).send(subjects);
});

router.get("/:id", async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    return res.status(404).send("subjects not found");
  }
  res.status(200).send(subject);
});

router.post("/", async (req, res) => {
  const { error } = validateSubject(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let subject = await Subject.findOne({ subject: req.body.subject });
  if (subject) {
    return res.status(400).send("subject is already present");
  }

  subject = new Subject({ subject: req.body.subject });
  await subject.save();
  res.status(200).send(subject);
});

router.put("/:id", async (req, res) => {
  const { error } = validateSubject(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const subject = await Subject.findByIdAndUpdate(
    req.params.id,
    { $set: { subject: req.body.subject } },
    { new: true, runValidators: true }
  );
  if (!subject) {
    return res.status(404).send("subject not found");
  }
  res.status(200).send(subject);
});

router.delete("/:id", async (req, res) => {
  const subject = await Subject.findByIdAndDelete(req.params.id);
  if (!subject) {
    return res.status(404).send("Subject not found");
  }

  res.status(200).send(subject);
});

module.exports = router;
