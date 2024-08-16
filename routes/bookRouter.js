const express = require("express");
const bookController = require("./../controllers/bookController");
const authController = require("./../controllers/authController");
const borrowRouter = require("./../routes/borrowRouter");
const router = express.Router();

router.use("/:bookId/borrow", borrowRouter);
router
  .route("/")
  .get(bookController.listBooks)
  .post(
    authController.protect,
    authController.restrict("admin"),
    bookController.addBook
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrict("admin"),
    bookController.updateBook
  )
  .delete(
    authController.protect,
    authController.restrict("admin"),
    bookController.deleteBook
  );
module.exports = router;
