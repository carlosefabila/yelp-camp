const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../utils/middleware.js");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const message = error.details.map(el => el.message).join(",");
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}

router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = await Review.create(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    req.flash("success", `Your review has been published, thank you for sharing your experience.`);
    res.redirect(`/campgrounds/${campground.id}`);
}));

router.delete("/:reviewId",  isLoggedIn, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash("warning", "Successfully deleted your review!");
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;