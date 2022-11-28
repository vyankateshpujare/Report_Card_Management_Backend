const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { standardSchema } = require("./standardsModel");
const Joi = require("joi");

const studentSchema = new Schema({
  rollNumber: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true,
  },
  middleName: {
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
  dob: {
    type: Date,
    required: true,
  },
  profile: {
    data: Buffer,
    name: String,
    mimetype: String,
  },
  parents: {
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true,
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true,
    },
    phone: {
      type: String,
      minLength: 7,
      maxLength: 10,
    },
    email: {
      type: String,
      required: true,
    },
    addressLine1: {
      type: String,
      required: true,
    },
    addressLine2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  isActive: {
    type: Boolean,
  },
});

const Student = mongoose.model("student", studentSchema);
function validateStudent(student) {
  const schema = Joi.object({
    rollNumber: Joi.number().min(1).max(100).required(),
    firstName: Joi.string().min(3).max(50).required(),
    middleName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    dob: Joi.date().required(),
    parents: Joi.object({
      firstName: Joi.string().min(3).max(50).required(),
      lastName: Joi.string().min(3).max(50).required(),
      phone: Joi.string().min(7).max(10),
      email: Joi.string().email(),
      addressLine1: Joi.string().required(),
      addressLine2: Joi.string(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
    }),
    isActive: Joi.boolean().default(false),
  });
  return schema.validate(student);
}
module.exports.Student = Student;
module.exports.studentSchema = studentSchema;
module.exports.validateStudent = validateStudent;
