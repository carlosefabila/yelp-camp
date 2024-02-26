const express = require("express");
const router = express.Router();
const passport = require("passport");
const { storeReturnTo } = require("../utils/middleware");
const users = require("../controllers/users");

// Register

router.route("/register")
    .get(users.renderRegisterForm)
    .post(users.registerNewUser)

// Login

router.route("/login")
    .get(users.renderLoginForm)
    .post(storeReturnTo,
        passport.authenticate("local", { failureFlash: true, failureRedirect: "/login"}),
        users.redirectLogedInUser)

// Logout

router.get("/logout", users.logoutUser)

module.exports = router;