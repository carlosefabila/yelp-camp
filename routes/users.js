const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");

// Register

router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body.user;
        const user = new User({ email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) { return next(err); }
            req.flash("success", `Welcome to Yelp-Camp ${username}`);
            res.redirect("/campgrounds");
        })
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/register");
    }
}))

// Login

router.get("/login", (req, res) => {
    res.render("users/login");
})

router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login"}), (req, res) => {
    req.flash("success", `Welcome back ${req.body.username}`);
    res.redirect("/campgrounds");
})

// Logout

router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if(err) {
            return next(err);
        }
        req.flash("success", "Come back soon!");
        res.redirect("/campgrounds");
    });
})

module.exports = router;