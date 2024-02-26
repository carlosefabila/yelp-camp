const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require("../utils/middleware");
const campgrounds = require("../controllers/campgrounds");

// CREATE

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.post("/", isLoggedIn, validateCampground, campgrounds.createCampground);

// READ

router.get("/", campgrounds.index);

router.get("/:id", campgrounds.showCampground);

// UPDATE

router.get("/:id/edit", isLoggedIn, isAuthor, campgrounds.renderEditForm);

router.put("/:id", isLoggedIn, isAuthor, validateCampground, campgrounds.updateCampground);

// DELETE
router.delete("/:id", isLoggedIn, isAuthor, campgrounds.deleteCampground);


module.exports = router;