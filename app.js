const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require('method-override');
const ejsEngine = require("ejs-mate");

mongoose.connect("mongodb://localhost:27017/yelp-camp")
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log("Ohh no!! MongoDB connection Error!!");
        console.log(err);
    })

const app = express();
const port = 3000;

app.engine("ejs", ejsEngine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(methodOverride('_method'));


app.get("/", (req, res) => {
    res.render("home");
})

// CREATE

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})

app.post("/campgrounds", async (req,res) => {
    const campground = await Campground.create(req.body.campground);
    res.redirect(`/campgrounds/${campground.id}`);
})

// READ

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
})

app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const selectedCampground = await Campground.findById(id);
    res.render("campgrounds/show", { selectedCampground });
})

// UPDATE

app.get("/campgrounds/:id/edit", async (req, res) => {
    const { id } = req.params;
    const selectedCampground = await Campground.findById(id);
    res.render("campgrounds/edit", { selectedCampground });
})

app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const editedCampground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true, runValidators: true});
    res.redirect(`/campgrounds/${editedCampground.id}`);
})

// DELETE
app.delete("/campgrounds/:id", async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
})

app.listen(3000, () => {
    console.log("Serving on port 3000");
})