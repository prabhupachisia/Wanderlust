const express = require("express");
const { wrapAsync, ExpressError } = require("../utils");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const { UserController } = require("../controllers");
const router = express.Router();

router.get("/signup", wrapAsync(UserController.renderSignupForm));

router.post("/signup", wrapAsync(UserController.userSignup));

router.get("/login", wrapAsync(UserController.renderLoginForm));

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/users/login', failureFlash: true }), wrapAsync(UserController.userLogin));

router.get("/logout", UserController.userLogout);

module.exports = router;