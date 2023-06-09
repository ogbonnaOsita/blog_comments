const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    const token = signToken(newUser._id);
    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = await req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "Please provide email or and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: "Incorrect email or password",
      });
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      result: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "Deleted successfully",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "you are not logged in! Please log in to get access",
        message: err,
      });
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "The user account no longer exist",
        message: err,
      });
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};
