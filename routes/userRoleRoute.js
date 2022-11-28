const express = require("express");
const { Division } = require("../dataModel/divisionsModel");
const { Role } = require("../dataModel/rolesModel");
const { Standard } = require("../dataModel/standardsModel");
const { Subject } = require("../dataModel/subjectsModel");
const { UserRole, validateUserRole } = require("../dataModel/userRolesModel");
const { User } = require("../dataModel/usersModel");
const router = express.Router();

router.get("/", async (req, res) => {
  const userRoles = await UserRole.find();
  if (!userRoles) {
    return res.status(404).send("userRole not found");
  }
  res.status(200).send(userRoles);
});

router.get("/:id", async (req, res) => {
  const userRole = await UserRole.findById(req.params.id);
  if (!userRole) {
    return res.status(404).send("userRole not found");
  }
  res.status(200).send(userRole);
});

router.post("/countuserroles", async (req, res) => {
  const { user, role } = req.body;
  let query = {};

  if (user) {
    let reg = new RegExp(`^${user}`, "i");
    query = { "user.firstName": reg };
  }
  if (role) {
    let reg = new RegExp(`^${role}`, "i");
    query = { "role.role": reg };
  }
  const totalNoOfUserRoles = await UserRole.find(query).count();
  console.log(totalNoOfUserRoles);
  return res.status(200).send(totalNoOfUserRoles + "");
});

router.post("/pfs", async (req, res) => {
  const { user, role, pageSize, currentPage } = req.body;
  let query = {};

  if (user) {
    let reg = new RegExp(`^${user}`, "i");
    query = { "user.firstName": reg };
  }
  if (role) {
    let reg = new RegExp(`^${role}`, "i");
    query = { "role.role": reg };
  }

  const skip = (currentPage - 1) * pageSize;
  const limit = pageSize;

  const userRoles = await UserRole.find(query).skip(skip).limit(limit);
  if (!userRoles) {
    return res.status(404).send("userRole not found");
  }
  res.status(200).send(userRoles);
});

router.post("/", async (req, res) => {
  const { error } = validateUserRole(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findById(req.body.user);
  if (!user) {
    return res.status(404).send("user not found");
  }

  const standard = await Standard.findById(req.body.standard);
  if (!standard) {
    return res.status(404).send("standard not found");
  }

  const division = await Division.findById(req.body.division);
  if (!division) {
    return res.status(404).send("division not found");
  }

  const role = await Role.findById(req.body.role);
  if (!role) {
    return res.status(404).send("role not found");
  }

  const subject = await Subject.findById(req.body.subject);
  if (!subject) {
    return res.status(404).send("subject not found");
  }

  const userRole = new UserRole({
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    standard: standard,
    division: {
      _id: division._id,
      division: division.division,
    },
    role: role,
    year: req.body.year,
    subject: subject,
  });
  await userRole.save();
  res.status(200).send(userRole);
});

router.put("/:id", async (req, res) => {
  const { error } = validateUserRole(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findById(req.body.user);
  if (!user) {
    return res.status(404).send("user not found");
  }

  const standard = await Standard.findById(req.body.standard);
  if (!standard) {
    return res.status(404).send("standard not found");
  }

  const division = await Division.findById(req.body.division);
  if (!division) {
    return res.status(404).send("division not found");
  }

  const role = await Role.findById(req.body.role);
  if (!role) {
    return res.status(404).send("role not found");
  }

  const subject = await Subject.findById(req.body.subject);
  if (!subject) {
    return res.status(404).send("subject not found");
  }

  const userRole = await UserRole.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        standard: standard,
        division: {
          _id: division._id,
          division: division.division,
        },
        role: role,
        year: req.body.year,
        subject: subject,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!userRole) {
    return res.status(404).send("userRole not found");
  }
  res.status(200).send(userRole);
});

router.delete("/:id", async (req, res) => {
  const userRole = await UserRole.findByIdAndDelete(req.params.id);
  if (!userRole) {
    return res.status(404).send("userRole not found");
  }
  res.status(200).send(userRole);
});

module.exports = router;
