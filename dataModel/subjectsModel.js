const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const subjectSchema = new Schema({
  subject: {
    type: String,
    minLength:2,
    maxLength:20,
    required: true,
  },
});

const Subject = mongoose.model("subject", subjectSchema);

function validateSubject(sub) {
  const schema = Joi.object({ subject: Joi.string().min(2).max(20).required() });
  return schema.validate(sub);
}

module.exports.Subject = Subject;
module.exports.subjectSchema = subjectSchema;
module.exports.validateSubject = validateSubject;
