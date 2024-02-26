const express = require("express");
const router = express.Router();
const passport = require("passport");
const { storeReturnTo } = require("../utils/middleware");
const users = require("../controllers/users");

// Register

router.get("/register", users.renderRegisterForm)

router.post("/register", users.registerNewUser)

// Login

router.get("/login", users.renderLoginForm)

router.post("/login",
    storeReturnTo,
    passport.authenticate("local", { failureFlash: true, failureRedirect: "/login"}),
    users.redirectLogedInUser)

// Logout

router.get("/logout", users.logoutUser)

module.exports = router;