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
            const price = Math.floor(Math.random() * 30) + 10;
            const camp = new Campground({
                title: `${sample(descriptors)} ${sample(places)}`,
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                //image: https://random.imagecdn.app/500/150, // Another option with actually random images.
                image: "https://images.unsplash.com/photo-1468956398224-6d6f66e22c35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTcwNzIzMzg0Mw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
                description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis aliquid error earum fugiat veniam vero consectetur repellat aperiam quas nobis non quidem nam pariatur quod, aliquam illo adipisci doloremque nihil!",
                price
            })
            await camp.save();
        }
    }

    seedDB().then( () => {
        mongoose.connection.close();
    });