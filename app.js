const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override');
const ejsEngine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");

const campgroundsRoutes = require("./routes/campgrounds.js");
const reviewsRoutes = require("./routes/reviews.js");

mongoose.connect("mongodb://localhost:27017/yelp-camp")
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log("Ohh no!! MongoDB connection Error!!");
        console.log(err);
    })

const app = express();
const port = 3000;

app.engine("ejs", ejsEngine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));

const millisecondsInAWeek = 1000 * 60 * 60 * 24 * 7;
const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + millisecondsInAWeek,
        maxAge: millisecondsInAWeek
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.warning = req.flash("warning");
    next(); 
})

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = "Something went wrong...";
    //res.status(statusCode).send(message);
    res.render("error", { err });
});

app.listen(port, () => {
    console.log("Serving on port 3000");
});