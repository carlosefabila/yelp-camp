const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../utils/middleware.js");

// CREATE

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req,res) => {
    const campground = await Campground.create({...req.body.campground, author: req.user._id });
    req.flash("success", "Successfully registered a new campground!");
    res.redirect(`/campgrounds/${campground.id}`);
}));

// READ

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const selectedCampground = await Campground.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate("author");
    if(!selectedCampground) {
        req.flash("error", "Sorry, we cannot find this Campground!");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { selectedCampground });
}));

// UPDATE

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const selectedCampground = await Campground.findById(id);
    if(!selectedCampground) {
        req.flash("error", "Sorry, we cannot find this Campground!");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { selectedCampground });
}));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const editedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true, runValidators: true});
    req.flash("success", `Your changes to ${editedCampground.title} were saved.`);
    res.redirect(`/campgrounds/${editedCampground.id}`);
}));

// DELETE
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("warning", `Succcessfully deleted the Campground: ${campground.title}`);
    res.redirect("/campgrounds");
}));


module.exports = router;