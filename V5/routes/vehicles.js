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
  var carAuthor = {
    id: req.user._id,
    username: req.user.username
  }

  var newCar = {name: carName, img: carImage, description: carDescription, author: carAuthor};

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
      res.redirect("/vehicles");
    } else {
      console.log(foundVehicle);
      res.render("vehicles/show.ejs", {vehicle: foundVehicle});
    }
  });
});

// EDIT
router.get("/:id/edit", checkOwnership, function(req, res) {

  Car.findById(req.params.id, function(err, foundVehicle) {
        res.render("vehicles/edit.ejs", {vehicle: foundVehicle});
  });

});

router.put("/:id", checkOwnership, function(req, res) {
    // find and update the vehicle
    Car.findByIdAndUpdate(req.params.id, req.body.vehicle, function(err, foundVehicle) {
      if(err) {
        res.redirect("/vehicles");
      } else {
        res.redirect("/vehicles/" + req.params.id)
      }
    })
    // redirect to SHOW PAGE
});

// DELETE
router.delete("/:id", checkOwnership, function(req, res) {
  Car.findByIdAndRemove(req.params.id, function(err) {
    if(err) {
      res.redirect("/vehicles");
    } else {
      res.redirect("/vehicles");
    }
  })
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkOwnership(req, res, next) {
  if(req.isAuthenticated()) {
    Car.findById(req.params.id, function(err, foundVehicle) {
      if(err) {
        res.redirect("/vehicles");
      } else {
        if(foundVehicle.author.id.equals(req.user._id)) {
          // res.render("vehicles/edit.ejs", {vehicle: foundVehicle});
          next();
        } else {
          res.redirect("back");
        }
      }
    })
  } else {
    res.redirect("back");
  }
}

module.exports = router;
