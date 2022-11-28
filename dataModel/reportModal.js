const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const { studentSchema } = require("./studentsModel");
const { testSchema } = require("./testsModel");
const { gradeSchema } = require("./gradesModel");

const reportSchema = new Schema({
  student: {
    type: studentSchema,
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  subjects: [{ type: String, required: true }],
  marks: [{ type: Number, required: true }],
  total: {
    type: Number,
    required: true,
  },
  remark: {
    type: String,
    default: null,
  },
  obtainedGrade: {
    type: gradeSchema,
  },
});

const Report = mongoose.model("Report", reportSchema);

const validateReport = (report) => {
  const schema = Joi.object({
    student: Joi.string().required(),
    testName: Joi.string().required(),
    remark: Joi.string(),
    obtainedGrade: Joi.string(),
  });
  return schema.validate(report);
};

module.exports.Report = Report;
module.exports.reportSchema = reportSchema;
module.exports.validateReport = validateReport;
