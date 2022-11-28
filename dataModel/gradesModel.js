const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const gradeSchema = new Schema({
  grade: {
    type: String,
    minLength: 1,
    maxLength: 2,
    required: true,
  },
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    max: 100,
    required: true,
  },
});

const Grade = mongoose.model("Grade", gradeSchema);

function validateGrade(grade) {
  const schema = Joi.object({
    grade: Joi.string().min(1).max(2).required(),
    start: Joi.number().required(),
    end: Joi.number().required(),
   
  });
  return schema.validate(grade);
}

module.exports.Grade = Grade;
module.exports.gradeSchema = gradeSchema;
module.exports.validateGrade = validateGrade;
