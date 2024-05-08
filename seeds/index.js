const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require("../models/campground");
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db =  mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 400; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({ 
            author:'660dc754d2bdec84013d3a0a',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price : price,
                        geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, 
                                cities[random1000].latitude]
            },
            images:[
                {
                    "url": "https://res.cloudinary.com/dathibx74/image/upload/v1714683088/YelpCamp/vsh8v0kpilv5dab6ly2d.jpg",
                    "filename": "YelpCamp/vsh8v0kpilv5dab6ly2d",
                  },
                  {
                    "url": "https://res.cloudinary.com/dathibx74/image/upload/v1714683088/YelpCamp/ov0bkge1fuxgryupxhom.jpg",
                    "filename": "YelpCamp/ov0bkge1fuxgryupxhom",
                    
                  }
            ]
        })
        await camp.save();
    };


}

seedDB();