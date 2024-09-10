const express = require("express");
const { wrapAsync } = require("../utils")
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const router = express.Router({ mergeParams: true });
const { ReviewController } = require("../controllers")

//Post Review
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.createReview));

//Delete review
router.delete("/:reviewId", isReviewAuthor, wrapAsync(ReviewController.deleteReview));

module.exports = router;