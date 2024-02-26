const Campground = require("../models/campground");
const Review = require("../models/review.js");
const catchAsync = require("../utils/catchAsync");

module.exports.createReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = await Review.create({ ...req.body.review, author: req.user._id});
    campground.reviews.push(review);
    await campground.save();
    req.flash("success", `Your review has been published, thank you for sharing your experience.`);
    res.redirect(`/campgrounds/${campground.id}`);
})

module.exports.deleteReview = catchAsync(async (req, res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }})
    await Review.findByIdAndDelete(reviewId);
    req.flash("warning", "Successfully deleted your review!");
    res.redirect(`/campgrounds/${id}`);
})