const Borrow = require("./../models/borrowSchema");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");
const CustomError = require("./../utils/customError");
const Book = require("./../models/bookModel");

exports.borrowBook = asyncErrorHandler(async (req, res, next) => {
  req.body.book = req.params.bookId;
  req.body.user = req.user.id;
  const book = await Borrow.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.returnBook = asyncErrorHandler(async (req, res, next) => {
  const book = await Borrow.findByIdAndUpdate(req.params.id, req.body, {
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

exports.borrowHistory = asyncErrorHandler(async (req, res, next) => {
  const id = req.user.id;
  const book = await Borrow.find({ user: id }).populate("book");
  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.mostBorrowedBooks = asyncErrorHandler(async (req, res, next) => {
  const books = await Borrow.aggregate([
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "bookDetails",
      },
    },
    {
      $unwind: "$bookDetails",
    },
    {
      $group: {
        _id: "$bookDetails.title",
        booksCount: { $sum: 1 },
      },
    },
    {
      $sort: { booksCount: -1 },
    },
    {
      $addFields: {
        book: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      books,
    },
  });
});

exports.activeMembers = asyncErrorHandler(async (req, res, next) => {
  const members = await Borrow.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $group: {
        _id: "$userDetails.name",
        borrowCount: { $sum: 1 },
      },
    },
    {
      $sort: { borrowCount: -1 },
    },
    {
      $addFields: {
        member: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      members,
    },
  });
});

exports.bookAvailability = asyncErrorHandler(async (req, res, next) => {
  const totalBooks = await Book.countDocuments();

  const borrowedBooks = await Borrow.aggregate([
    {
      $group: {
        _id: "$book",
        borrowCount: { $sum: 1 },
      },
    },
  ]);

  const availableBooks = totalBooks - borrowedBooks.length;

  res.status(200).json({
    status: "success",
    data: {
      totalBooks,
      borrowedBooks: borrowedBooks.length,
      availableBooks,
    },
  });
});
