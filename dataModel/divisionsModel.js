const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const { standardSchema } = require("./standardsModel");

const divisionSchema = new Schema({
  division: {
    type: String,
    maxLength: 1,
    minLength: 1,
  },
  standard: {
    type: standardSchema,
    required:true,
  },
});

const Division = mongoose.model("division", divisionSchema);

function validateDivision(div) {
  const schema = Joi.object({
    standard:Joi.string().required(),
    division: Joi.string().min(1).max(1).required(),
  });
  return schema.validate(div);
}

module.exports.Division = Division;
module.exports.divisionSchema = divisionSchema;
module.exports.validateDivision = validateDivision;
