const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const standardSchema = new Schema({
  standard: {
    type: String,
    minLength:1,
    maxLength:4,
    required:true,
  },
});

const Standard = mongoose.model("standard", standardSchema);

function validateStandard(std) {
  const schema = Joi.object({
    standard: Joi.string().min(1).max(4).required(),
  });
  return schema.validate(std);
}

module.exports.Standard = Standard;
module.exports.standardSchema = standardSchema;
module.exports.validateStandard = validateStandard;
