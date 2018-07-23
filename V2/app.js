var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true }));

mongoose.connect("mongodb://localhost:27017/Cartopia", { useNewUrlParser: true });

// SCHEMA SET UP

var carSchema = new mongoose.Schema({
  name: String,
  img: String,
  description: String
});

var Car = mongoose.model("Car", carSchema);

// var vehicles = [
//   {name: "Lamborghini Aventador", img: "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/share%20img/aventador-sv-facebook-og.jpg"},
//   {name: "Lamborghini Huracon", img: "https://s3.caradvice.com.au/thumb/960/500/wp-content/uploads/2018/01/lamborghini_huracan_performante_review_hero.jpg"},
//   {name: "Tesla Model X ", img: "https://www.teslamagazin.sk/wp-content/uploads/2018/02/tesla-model-x-p100d-specifikacie.jpg"},
//   {name: "Aston Martin DB11", img: "https://st.motortrend.com/uploads/sites/10/2016/10/2017-Aston-Martin-DB11-front-three-quarter-16.jpg"},
//   {name: "Lamborghini Aventador", img: "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/share%20img/aventador-sv-facebook-og.jpg"},
//   {name: "Lamborghini Huracon", img: "https://s3.caradvice.com.au/thumb/960/500/wp-content/uploads/2018/01/lamborghini_huracan_performante_review_hero.jpg"},
//   {name: "Tesla Model X ", img: "https://www.teslamagazin.sk/wp-content/uploads/2018/02/tesla-model-x-p100d-specifikacie.jpg"},
//   {name: "Aston Martin DB11", img: "https://st.motortrend.com/uploads/sites/10/2016/10/2017-Aston-Martin-DB11-front-three-quarter-16.jpg"}
//   // {name: "BMW i8", img: ""},
//   // {name: "Rolls Royce Phantom", img: ""},
//   // {name: "Tesla Model S", img: ""}
// ];

app.get("/", function(req, res) {
  // res.send("This is the landing page");
  res.render("landing.ejs");
});

app.get("/vehicles", function(req, res) {
  Car.find({}, function(err, allCars) {
    if(err) {
      console.log(err);
    } else {
      res.render("vehicles.ejs", {vehicles: allCars});
    }
  })
  // res.render("vehicles.ejs", {vehicles: vehicles});
});

app.post("/vehicles", function(req, res) {
  var carName = req.body.name;
  var carImage = req.body.image;
  var carDescription = req.body.description;

  var newCar = {name: carName, img: carImage, description: carDescription};

  Car.create(newCar, function(err, item) {
    if(err) {
      console.log(err);
    } else {
      console.log("Car has been added to the database");
      console.log(item);
    }
  });

  res.redirect("/vehicles");
});

app.get("/vehicles/new", function(req, res) {
  res.render("newVehicle.ejs");
});

app.get("/vehicles/:id", function(req, res) {
  Car.findById(req.params.id, function(err, foundVehicle) {
    if(err) {
      console.log(err);
    } else {
      res.render("show.ejs", {vehicle: foundVehicle});
    }
  });
});

app.listen(3000, function() {
  console.log("Now running Cartopia Server");
});
