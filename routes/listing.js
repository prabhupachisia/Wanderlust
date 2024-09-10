const express = require("express");
const wrapAsync = require("../utils/wrapAsync")
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const { ListingController } = require("../controllers/index");
const multer = require('multer');
const { storage, cloudinary } = require("../cloudConfig");
const upload = multer({ storage });

//Index Route
router.get("/", wrapAsync(ListingController.Index));

//New Route
router.get("/new", isLoggedIn, wrapAsync(ListingController.renderNewForm));

//Show Route
router.get("/:id", wrapAsync(ListingController.showListing));

//Create Route
router.post("/",
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(ListingController.createListing)
);

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

//Update Route
router.patch("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing));

module.exports = router;