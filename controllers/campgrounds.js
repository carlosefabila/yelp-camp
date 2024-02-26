const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");

// Create

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = catchAsync(async (req,res) => {
    const campground = await Campground.create({...req.body.campground, author: req.user._id });
    req.flash("success", "Successfully registered a new campground!");
    res.redirect(`/campgrounds/${campground.id}`);
})

// Read

module.exports.index = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
})

module.exports.showCampground = catchAsync(async (req, res) => {
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
})

// Update

module.exports.renderEditForm = catchAsync(async (req, res) => {
    const { id } = req.params;
    const selectedCampground = await Campground.findById(id);
    if(!selectedCampground) {
        req.flash("error", "Sorry, we cannot find this Campground!");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { selectedCampground });
})

module.exports.updateCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const editedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true, runValidators: true});
    req.flash("success", `Your changes to ${editedCampground.title} were saved.`);
    res.redirect(`/campgrounds/${editedCampground.id}`);
})

// Delete

module.exports.deleteCampground = catchAsync(async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("warning", `Succcessfully deleted the Campground: ${campground.title}`);
    res.redirect("/campgrounds");
})