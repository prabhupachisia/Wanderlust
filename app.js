if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodover = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError');
const { ListingRoute, ReviewRoute, UserRoute } = require("./routes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const { User } = require("./models");
const LocalStrategy = require("passport-local");
const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,

});

store.on("error", () => {
    console.log("session store error");
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.engine("ejs", ejsMate);
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodover("_method"));
app.use(express.static(path.join(__dirname, "/public")));

//connecting with database
main().then(() => {
    console.log("connection with database successfull");
}).catch(err => { console.log(err) });
async function main() {
    await mongoose.connect(dbUrl);
}
//general route
app.get("/", (req, res) => {
    res.redirect("/listings");
});


app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.use("/listings", ListingRoute);
app.use("/listings/:id/review", ReviewRoute);
app.use("/users", UserRoute);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

//Error Handling
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    //res.status(statusCode).send(message);
});

//asigning the port
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

