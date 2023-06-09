const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    emum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm password"],
    validate: {
      //This only works on save and on create
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 12);
  //delete the password confirm field
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
