const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const { studentSchema } = require("./studentsModel");
const { testSchema } = require("./testsModel");

const studentTestResultSchema = new Schema({
  student: {
    type: studentSchema,
    required: true,
  },
  test: {
    type: testSchema,
    required: true,
  },
  obtainedMarks: {
    type: Number,
    max: 100,
    required :true
  },
  obtainedGrade: {
    type: mongoose.Types.ObjectId,
    default:null,
  },
});

const StudentTestResult = mongoose.model(
  "StudentTestResult",
  studentTestResultSchema
);

function validateTestResult(result) {
  const schema = Joi.object({
    student: Joi.string().required(),
    test: Joi.string().required(),
    obtainedMarks: Joi.number().max(100).required(),
    GradeId: Joi.string().default(null),
  });
  return schema.validate(result);
}

module.exports.StudentTestResult = StudentTestResult;
module.exports.validateTestResult = validateTestResult;
