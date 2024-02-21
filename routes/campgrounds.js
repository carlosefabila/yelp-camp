const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require("../schemas.js");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const message = error.details.map(el => el.message).join(",")
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

// CREATE

router.get("/new", (req, res) => {
    res.render("campgrounds/new");
});

router.post("/", validateCampground, catchAsync(async (req,res) => {
    const campground = await Campground.create(req.body.campground);
    res.redirect(`/campgrounds/${campground.id}`);
}));

// READ

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const selectedCampground = await Campground.findById(id).populate("reviews");
    res.render("campgrounds/show", { selectedCampground });
}));

// UPDATE

router.get("/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const selectedCampground = await Campground.findById(id);
    res.render("campgrounds/edit", { selectedCampground });
}));

router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const editedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true, runValidators: true});
    res.redirect(`/campgrounds/${editedCampground.id}`);
}));

// DELETE
router.delete("/:id", catchAsync(async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));


module.exports = router;