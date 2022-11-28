const Joi = require("joi");
const mongoose = require("mongoose");
const { standardSchema } = require("./standardsModel");
const { subjectSchema } = require("./subjectsModel");
const Schema = mongoose.Schema;

const testSchema = new Schema({
  testName: {
    type: String,
    minLength: 3,
    maxLength: 30,
    required: true,
  },
  totalMarks: {
    type: Number,
    min: 20,
    max: 100,
    required: true,
  },
  subject: {
    type: subjectSchema,
    required: true,
  },
  standard: {
    type: standardSchema,
    required: true,
  },
  division: {
    type: new Schema({
      division: {
        type: String,
        maxLength: 1,
        minLength: 1,
      },
    }),
    required: true,
  },
  year: {
    type: Number,
    min: 2000,
    max: 2022,
    required: true,
  },
  highestMarks: {
    type: Number,
    max: 100,
  },
  averageMarks: {
    type: Number,
  },
});

const Test = mongoose.model("Test", testSchema);

function validateTest(test) {
  const schema = Joi.object({
    testName: Joi.string().min(3).max(30).required(),
    totalMarks: Joi.number().required(),
    year: Joi.number().min(2000).required(),
    highestMarks: Joi.number().max(100),
    averageMarks: Joi.number(),
  });
  return schema.validate(test);
}
module.exports.Test = Test;
module.exports.testSchema = testSchema;
module.exports.validateTest = validateTest;
