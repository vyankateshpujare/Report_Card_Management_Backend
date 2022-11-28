const express = require("express");
const { Standard, validateStandard } = require("../dataModel/standardsModel");
const router = express.Router();

router.get("/", async (req, res) => {
  const standards = await Standard.find().sort({ name: 1 });
  if (!standards) {
    return res.status(404).send("Standards not found");
  }
  res.status(200).send(standards);
});

router.get("/:id", async (req, res) => {
  const standard = await Standard.findById(req.params.id);
  if (!standard) {
    return res.status(404).send("Standards not found");
  }
  res.status(200).send(standard);
});

router.post("/duplicate", async (req, res) => {
  let standard = await Standard.findOne({ standard: req.body.standard });
  if (standard) {
    return res.status(400).send("Standard already present");
  }
});

router.post("/pfs", async (req, res) => {
  const { standard, currentPage, pageSize } = req.body;
  let query = {};

  if (standard) {
    query["standard"] = standard;
  }

  const skip = (currentPage - 1) * pageSize;
  const limit = pageSize;

  const standards = await Standard.find(query).limit(limit).skip(skip);
  if (!standards) {
    return res.status(404).send("Standards not found");
  }
  res.status(200).send(standards);
});

router.post("/countstandard", async (req, res) => {
  const { standard } = req.body;
  let query = {};
  if (standard) {
    query["standard"] = standard;
  }
  const totalNoOfStandards = await Standard.find(query).count();
  return res.status(200).send(totalNoOfStandards + "");
});

router.post("/", async (req, res) => {
  const { error } = validateStandard(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }

  let standard = await Standard.findOne({ standard: req.body.standard });
  if (standard) {
    return res.status(401).send("Standard already present");
  }

  standard = new Standard({ standard: req.body.standard });
  await standard.save();
  res.status(200).send(standard);
});

router.put("/:id", async (req, res) => {
  const { error } = validateStandard(req.body);
  if (error) {
    console.log(error);
    return res.status(400).send(error.details[0].message);
  }

  let standard = await Standard.findOne({ standard: req.body.standard });
  if (standard) {
    return res.status(400).send("Standard already present");
  }
  standard = await Standard.findByIdAndUpdate(
    req.params.id,
    { $set: { standard: req.body.standard } },
    { new: true, runValidators: true }
  );

  if (!standard) {
    return res.status(404).send("Standard not found");
  }

  res.status(200).send(standard);
});

router.delete("/:id", async (req, res) => {
  const standard = await Standard.findByIdAndDelete(req.params.id);
  if (!standard) {
    return res.status(404).send("Standard not found");
  }

  res.status(200).send(standard);
});
module.exports = router;
