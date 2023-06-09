const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const blogRouter = require("./routes/blogRoutes");
const userRouter = require("./routes/userRoutes");
const commentRouter = require("./routes/commentRoutes");
// const viewRouter = require('./routes/viewRoutes');

const app = express();

//Body parser, reading data from the body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

//3)Routes
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);

//ROUTE HANDLER
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// app.use(globalErrorHandler);

module.exports = app;
