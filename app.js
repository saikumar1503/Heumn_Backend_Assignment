require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRouter");
const bookRouter = require("./routes/bookRouter");
const borrowRouter = require("./routes/borrowRouter");
const CustomError = require("./utils/customError");
const app = express();
app.use(express.json());

app.use("/", bookRouter);

app.use("/api/user", userRouter);
app.use("/api/book", bookRouter);
app.use("/api/borrow", borrowRouter);

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `cant find ${req.originalUrl} on the server`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

mongoose
  .connect(process.env.mongodb_url)
  .then(() => console.log("connected to database"));

app.listen(7000, () => console.log("server has started"));
