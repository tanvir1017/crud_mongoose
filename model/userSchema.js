const mongoose = require("mongoose");

//  ! MONGOOSE SCHEMA
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  work: {
    type: String,
  },
  password: {
    type: String,
  },
  cPassword: {
    type: String,
  },
});

//! MODEL DEFINE
const User = mongoose.model("USERS", userSchema);

module.exports = User;
