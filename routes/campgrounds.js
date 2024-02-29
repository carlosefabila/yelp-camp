const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require("../utils/middleware");
const campgrounds = require("../controllers/campgrounds");
const multer  = require('multer')
const { storage } = require("../cloudinary");
const upload = multer({ storage })

router.route("/")
    .get(campgrounds.index)
    // .post(isLoggedIn, validateCampground, campgrounds.createCampground);
    .post(upload.single("image"), (req, res) => {
        console.log(req.body, req.file);
        res.send(req.body);
    })

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(campgrounds.showCampground)
    .put(isLoggedIn, isAuthor, validateCampground, campgrounds.updateCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground);

router.get("/:id/edit", isLoggedIn, isAuthor, campgrounds.renderEditForm);

module.exports = router;