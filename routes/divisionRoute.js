const express = require("express");
const { Division, validateDivision } = require("../dataModel/divisionsModel");
const { Standard } = require("../dataModel/standardsModel");
const router = express.Router();

router.get("/", async (req, res) => {
  const divisions = await Division.find();
  if (!divisions) {
    return res.status(404).send("divisions not found");
  }
  res.status(200).send(divisions);
});

router.get("/:id", async (req, res) => {
  const division = await Division.findById(req.params.id);
  if (!division) {
    return res.status(404).send("division not found");
  }
  res.status(200).send(division);
});

router.post("/countdivision", async (req, res) => {
  const { standard, division } = req.body;
  let query1 = {};

  if (standard) {
    query1["standard.standard"] = standard;
  }
  if (division) {
    query1["division"] = division;
  }
  const totalNoOfDivisions = await Division.find(query1).count();
  console.log(totalNoOfDivisions);
  return res.status(200).send(totalNoOfDivisions + "");
});

router.post("/pfs", async (req, res) => {
  const { standard, division, pageSize, currentPage } = req.body;
  let query1 = {};

  if (standard) {
    query1["standard.standard"] = standard;
  }
  if (division) {
    query1["division"] = division;
  }

  const skip = (currentPage - 1) * pageSize;
  const limit = pageSize;

  const divisions = await Division.find(query1).skip(skip).limit(limit);
  if (!divisions) {
    return res.status(404).send("divisions not found");
  }
  res.status(200).send(divisions);
});

router.post("/", async (req, res) => {
  const { error } = validateDivision(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }

  let standard = await Standard.findById(req.body.standard);
  if (!standard) {
    return res.status(400).send("Standard with given id not found ");
  }

  let divisions = await Division.find({ division: req.body.division });
  let flag = false;
  divisions.map((d) => {
    if (
      d.standard._id.toString() === standard._id.toString() &&
      d.division === req.body.division
    ) {
      flag = true;
    }
  });
  if (flag) {
    return res
      .status(500)
      .send(
        "Division is already Present in " + standard.standard + " Standard"
      );
  }

  let division = new Division({
    division: req.body.division,
    standard: standard,
  });

  await division.save();
  res.status(200).send(division);
});

router.put("/:id", async (req, res) => {
  console.log({ boody: req.body });
  const { error } = validateDivision(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }
  let standard = await Standard.findById(req.body.standard);
  if (!standard) {
    return res.status(600).send("Standard with given id not found ");
  }

  let divisions = await Division.find({ division: req.body.division });
  let flag = false;
  divisions.map((d) => {
    if (
      d.standard._id.toString() === standard._id.toString() &&
      d.division === req.body.division
    ) {
      flag = true;
    }
  });
  if (flag) {
    return res.status(500).send("Division is already present");
  }

  const division = await Division.findByIdAndUpdate(
    req.params.id,
    { $set: { division: req.body.division, standard: standard } },
    { new: true, runValidators: true }
  );
  if (!division) {
    return res.status(404).send("Division not found");
  }

  res.status(200).send(division);
});

router.delete("/:id", async (req, res) => {
  const division = await Division.findByIdAndDelete(req.params.id);
  if (!division) {
    return res.status(404).send("Division not found");
  }
  res.status(200).send(division);
});
module.exports = router;
