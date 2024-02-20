const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Review = require("./models/review.js");
const methodOverride = require('method-override');
const ejsEngine = require("ejs-mate");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const expressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const campground = require("./models/campground");

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

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const message = error.details.map(el => el.message).join(",")
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    res.render("home");
});

// CREATE

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", validateCampground, catchAsync(async (req,res) => {
    const campground = await Campground.create(req.body.campground);
    res.redirect(`/campgrounds/${campground.id}`);
}));

// READ

app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const selectedCampground = await Campground.findById(id);
    res.render("campgrounds/show", { selectedCampground });
}));

// UPDATE

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const selectedCampground = await Campground.findById(id);
    res.render("campgrounds/edit", { selectedCampground });
}));

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const editedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true, runValidators: true});
    res.redirect(`/campgrounds/${editedCampground.id}`);
}));

// DELETE
app.delete("/campgrounds/:id", catchAsync(async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));

app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = await Review.create(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
}));

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})

app.use((err, req, res, next) => {
    if (!err.statusCode) err.statusCode = 500;
    if (!err.message) err.message = "Something went wrong...";
    //res.status(statusCode).send(message);
    res.render("error", { err });
});

app.listen(3000, () => {
    console.log("Serving on port 3000");
});