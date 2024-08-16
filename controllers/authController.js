const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const util = require("util");
const CustomError = require("./../utils/customError");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");

const signToken = (id) => {
  return jwt.sign({ id: id }, "fgjiotcnvsee", {
    expiresIn: 1000000,
  });
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      newUser,
    },
  });
});

exports.login = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    const error = new CustomError("enter email and password", 400);
    return next(error);
  }
  const user = await User.findOne({ email });

  const isMatch = await user.comparePasswordInDb(password, user.password);

  if (!user || !isMatch) {
    const error = new CustomError("incorrect email or password", 400);
    return next(error);
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  if (!token) {
    return next(new CustomError("your are not logged in! please login", 401));
  }
  const decodedToken = await util.promisify(jwt.verify)(token, "fgjiotcnvsee");
  const user = await User.findById(decodedToken.id);
  req.user = user;
  next();
});

exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new CustomError(
        "You do not have permission for this action",
        401
      );
      return next(error);
    }
    next();
  };
};
