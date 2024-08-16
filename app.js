const express = require("express");
const mongoose = require("mongoose");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRouter");
const bookRouter = require("./routes/bookRouter");
const borrowRouter = require("./routes/borrowRouter");
const app = express();
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/book", bookRouter);
app.use("/api/borrow", borrowRouter);
app.use(globalErrorHandler);

mongoose
  .connect("mongodb://localhost:27017/nalanda")
  .then(() => console.log("connected to database"));

app.listen(7000, () => console.log("server has started"));
