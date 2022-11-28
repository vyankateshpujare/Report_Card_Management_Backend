const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const { standardSchema } = require("./standardsModel");
const { roleSchema } = require("./rolesModel");
const { subjectSchema } = require("./subjectsModel");

const userRoleSchema = new Schema({
  user: {
    type: new Schema({
      _id: {
        type: mongoose.Types.ObjectId,
      },
      firstName: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true,
      },
      lastName: {
        type: String,
        minLength: 3,
        maxLength: 50,
        required: true,
      },
    }),
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
  role: {
    type: roleSchema,
    required: true,
  },
  year: {
    type: Number,
    min: 1900,
    max: 2022,
  },
  subject: {
    type: subjectSchema,
    required: true,
  },
});

const UserRole = mongoose.model("userRole", userRoleSchema);

function validateUserRole(userRole) {
  const schema = Joi.object({
    user: Joi.string().required(),
    standard: Joi.string().required(),
    division: Joi.string().required(),
    role: Joi.string().required(),
    year: Joi.number().min(1900).max(2022).required(),
    subject: Joi.string().required(),
  });
  return schema.validate(userRole);
}
module.exports.UserRole = UserRole;
module.exports.userRoleSchema = userRoleSchema;
module.exports.validateUserRole = validateUserRole;
