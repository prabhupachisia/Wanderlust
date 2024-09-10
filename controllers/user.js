const { User } = require("../models");

module.exports.renderSignupForm = (req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.userSignup = async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
    })
};

module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
};

module.exports.userLogin = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    if (res.locals.redirectUrl) {
        res.redirect(res.locals.redirectUrl);
    } else {
        res.redirect("/listings");
    }
};

module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    })
}