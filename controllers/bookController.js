const asyncErrorHandler = require("./../utils/asyncErrorHandler");
const Book = require("./../models/bookModel");
const CustomError = require("../utils/customError");

exports.addBook = asyncErrorHandler(async (req, res, next) => {
  const book = await Book.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.updateBook = asyncErrorHandler(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.deleteBook = asyncErrorHandler(async (req, res, next) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.listBooks = asyncErrorHandler(async (req, res, next) => {
  let excludeFields = ["page", "limit"];
  let queryObj = { ...req.query };
  excludeFields.forEach((ele) => delete queryObj[ele]);
  let query = Book.find(queryObj);

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  let skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const booksCount = await Book.countDocuments(queryObj);
    if (skip >= booksCount) {
      const error = new CustomError("this page not found", 404);
      return next(error);
    }
  }
  const book = await query;
  if (book.length == 0) {
    return next(new CustomError("no book found", 404));
  }

  res.status(200).json({
    status: "success",
    data: book,
  });
});
