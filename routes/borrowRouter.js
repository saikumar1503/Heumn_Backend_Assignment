const express = require("express");
const borrowController = require("./../controllers/borrowController");
const authController = require("./../controllers/authController");
const router = express.Router({ mergeParams: true });
router
  .route("/")
  .post(authController.protect, borrowController.borrowBook)
  .get(authController.protect, borrowController.borrowHistory);
router.route("/:id").patch(authController.protect, borrowController.returnBook);

router.route("/mostBorrowedBooks").get(borrowController.mostBorrowedBooks);
router.route("/activeMembers").get(borrowController.activeMembers);
router.route("/bookAvailability").get(borrowController.bookAvailability);
module.exports = router;
