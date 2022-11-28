const express = require("express");
const { Student, validateStudent } = require("../dataModel/studentsModel");
const { Standard } = require("../dataModel/standardsModel");
const { Division } = require("../dataModel/divisionsModel");
const { UserRole } = require("../dataModel/userRolesModel");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.filename + "_" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.use(express.static(__dirname + "public/"));

router.get("/", async (req, res) => {
  const students = await Student.find();
  if (!students) {
    return res.status(404).send("students not found");
  }
  res.status(200).send(students);
});

router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).send("student not found");
  }
  res.status(200).send(student);
});

router.post("/allstudents", async (req, res) => {
  const { userId, firstName, rollNumber } = req.body;
  const userRoles = await UserRole.find();
  const user = userRoles.find((ur) => ur.user._id == userId);
  let query1 = {};
  let query2 = {};
  let query3 = {};

  query1["standard.standard"] = user.standard.standard;
  query2["division.division"] = user.division.division;

  if (firstName) {
    query3["firstName"] = firstName;
  }
  if (rollNumber) {
    query3["rollNumber"] = rollNumber;
  }
  const students = await Student.find({
    $and: [query1, query2, query3],
  });
  if (!students) {
    return res.status(404).send("students not found");
  }
  res.status(200).send(students);
});

router.post("/:userId", upload.single("file"), async (req, res) => {
  const { error } = validateStudent(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const userRoles = await UserRole.find();
  const user = userRoles.find((ur) => ur.user._id == req.params.userId);

  let query1 = {};
  let query2 = {};
  let query3 = {};

  query1["standard.standard"] = user.standard.standard;
  query2["division.division"] = user.division.division;

  if (req.body.firstName) {
    query3["firstName"] = req.body.firstName;
  }
  const students = await Student.find({ $and: [query1, query2, query3] });
  if (students) {
    const student = students.find(
      (student) => student.rollNumber == req.body.rollNumber
    );
    if (student) {
      return res.status(400).send("Roll number is already assigned");
    }
  }

  const student = new Student({
    rollNumber: req.body.rollNumber,
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    standard: {
      _id: user.standard._id,
      standard: user.standard.standard,
    },
    division: {
      _id: user.division._id,
      division: user.division.division,
    },
    year: user.year,
    dob: req.body.dob,
    profile: {
      name: req.file.originalname,
      data: req.file.buffer,
      mimetype: req.file.mimetype,
    },
    parents: {
      firstName: req.body.parents.firstName,
      lastName: req.body.parents.lastName,
      phone: req.body.parents.phone,
      email: req.body.parents.email,
      addressLine1: req.body.parents.addressLine1,
      addressLine2: req.body.parents.addressLine2,
      city: req.body.parents.city,
      state: req.body.parents.state,
      zipCode: req.body.parents.zipCode,
    },
    isActive: req.body.isActive,
  });
  await student.save();
  res.status(200).send(student);
});

router.put("/:id/:userId", async (req, res) => {
  const { error } = validateStudent(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const userRoles = await UserRole.find();
  const user = userRoles.find((ur) => ur.user._id == req.params.userId);

  const student = await Student.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        rollNumber: req.body.rollNumber,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        standard: {
          _id: user.standard._id,
          standard: user.standard.standard,
        },
        division: {
          _id: user.division._id,
          division: user.division.division,
        },
        year: user.year,
        dob: req.body.dob,
        parents: {
          firstName: req.body.parents.firstName,
          lastName: req.body.parents.lastName,
          phone: req.body.parents.phone,
          email: req.body.parents.email,
          addressLine1: req.body.parents.addressLine1,
          addressLine2: req.body.parents.addressLine2,
          city: req.body.parents.city,
          state: req.body.parents.state,
          zipCode: req.body.parents.zipCode,
        },
        isActive: req.body.isActive,
      },
    },
    { new: true, runValidators: true }
  );

  if (!student) {
    return res.status(404).send("student not found");
  }

  res.status(200).send(student);
});

router.delete("/:id", async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    return res.status(404).send("student not found");
  }

  res.status(200).send(student);
});
module.exports = router;
