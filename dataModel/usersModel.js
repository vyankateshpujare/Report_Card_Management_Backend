const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");

const userSchema = new Schema({
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
  email: {
    type: String,
    minLength: 5,
    maxLength: 50,
    required: true,
  },
  phone: {
    type: String,
    minLength: 7,
    maxLength: 10,
    required: true,
  },
  userName: {
    type: String,
    minLength: 3,
    maxLength: 50,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024,
    required: true,
  },
  lastLoggedIn: {
    type: Date,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  updatedBy: {
    type: mongoose.Types.ObjectId,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

userSchema.methods.getAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("user", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(7).max(10).required(),
    userName: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(8).max(1024).required(),
    isActive: Joi.boolean().default(true),
    isAdmin: Joi.boolean(),
    updatedBy: Joi.string().default(null),
    updatedAt: Joi.date().default(null),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.userSchema = userSchema;
module.exports.validateUser = validateUser;
