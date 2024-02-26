const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

//Register

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
}

module.exports.registerNewUser = catchAsync(async (req, res) => {
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
})

// Login

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

module.exports.redirectLogedInUser = (req, res) => {
    req.flash("success", `Welcome back ${req.body.username}`);
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
}

// Logout

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if(err) {
            return next(err);
        }
        req.flash("success", "Come back soon!");
        res.redirect("/campgrounds");
    });
}