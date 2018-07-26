var express = require('express');
var router = express.Router();
var Car = require('../models/vehicle');

// INDEX
router.get("/", function(req, res) {
  Car.find({}, function(err, allCars) {
    if(err) {
      console.log(err);
    } else {
      res.render("vehicles/vehicles.ejs", {vehicles: allCars});
    }
  })
  // res.render("vehicles.ejs", {vehicles: vehicles});
});

// CREATE
router.post("/", function(req, res) {
  var carName = req.body.name;
  var carImage = req.body.image;
  var carDescription = req.body.description;

  var newCar = {name: carName, img: carImage, description: carDescription};

  Car.create(newCar, isLoggedIn, function(err, item) {
    if(err) {
      console.log(err);
    } else {
      console.log("Car has been added to the database");
      console.log(item);
    }
  });

  res.redirect("/vehicles");
});

// NEW
router.get("/new", isLoggedIn, function(req, res) {
  res.render("vehicles/newVehicle.ejs");
});

// SHOW
router.get("/:id", function(req, res) {
  Car.findById(req.params.id).populate("comments").exec(function(err, foundVehicle) {
    if(err) {
      console.log(err);
    } else {
      console.log(foundVehicle);
      res.render("vehicles/show.ejs", {vehicle: foundVehicle});
    }
  });
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

module.exports = router;
