const express = require("express");
const { Role, validateRole } = require("../dataModel/rolesModel");
const { post } = require("./studentRoute");
const router = express.Router();

router.get("/", async (req, res) => {
  const roles = await Role.find();
  if (!roles) {
    return res.status(404).send("roles not found");
  }
  res.status(200).send(roles);
});

router.get("/:id", async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    return res.status(404).send("role not found");
  }
  res.status(200).send(role);
});

router.post("/pfs", async (req, res) => {
  const { role } = req.body;
  let query = {};
  if (role) {
    let reg = new RegExp(`^${role}`, "i");
    query = { role: reg };
  }
  const roles = await Role.find(query);
  if (!roles) {
    return res.status(404).send("roles not found");
  }
  res.status(200).send(roles);
});

router.post("/", async (req, res) => {
  const { error } = validateRole(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let role = await Role.findOne({ role: req.body.role });
  if (role) {
    return res.status(400).send(`Role ${role.role} is already present`);
  }

  role = await Role({ role: req.body.role });
  await role.save();
  res.status(200).send(role);
});

router.put("/:id", async (req, res) => {
  const { error } = validateRole(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const role = await Role.findByIdAndUpdate(
    req.params.id,
    { $set: { role: req.body.role } },
    { new: true, runValidators: true }
  );

  if (!role) {
    return res.status(404).send("role withn given id not found");
  }
  res.status(200).send(role);
});

router.delete("/:id", async (req, res) => {
  const role = await Role.findByIdAndDelete(req.params.id);
  if (!role) {
    return res.status(404).send("Role with given id not found");
  }

  res.status(200).send(role);
});
module.exports = router;
