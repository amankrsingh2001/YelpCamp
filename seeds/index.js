const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

//database connetion
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random()*20)+10
    const camp = new Campground({
      author:'66561c4f7757a6dccfc934f0',
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image:'http://source.unsplash.com/collection/483251',
      description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti eligendi hic assumenda quisquam itaque voluptatibus ex enim consequuntur illum molestias dolores porro exercitationem, tempore nemo quia doloremque repellat, incidunt minima",
      price
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
