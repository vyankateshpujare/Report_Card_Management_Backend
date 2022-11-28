const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const roleSchema = new Schema({
  role: {
    type: String,
    minLength: 5,
    maxLength: 20,
    required: true,
  },
});

const Role = mongoose.model("role", roleSchema);

function validateRole(role) {
  const schema = Joi.object({
    role: Joi.string().min(5).max(20).required(),
  });
  return schema.validate(role);
}

module.exports.Role = Role;
module.exports.roleSchema = roleSchema;
module.exports.validateRole = validateRole;
