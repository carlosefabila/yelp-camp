const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp")
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log("Ohh no!! MongoDB connection Error!!");
        console.log(err);
    })

    const sample = array => array[Math.floor(Math.random() * array.length)];

    const seedDB = async () => {
        await Campground.deleteMany({});
        for(let i = 0; i < 50; i++){
            const random1000 = Math.floor(Math.random() * 1000);
            const camp = new Campground({
                title: `${sample(descriptors)} ${sample(places)}`,
                location: `${cities[random1000].city}, ${cities[random1000].state}`
            })
            await camp.save();
        }
    }

    seedDB().then( () => {
        mongoose.connection.close();
    });