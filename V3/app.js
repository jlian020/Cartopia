var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Car = require('./models/vehicle'),
    Comment = require('./models/comment'),
    seedDB = require('./seed')


mongoose.connect("mongodb://localhost:27017/Cartopia", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true }));
// app.use("/", express.static(__dirname + "/public"));
seedDB();

// SCHEMA SET UP

app.get("/", function(req, res) {
  // res.send("This is the landing page");
  res.render("landing.ejs");
});

// INDEX
app.get("/vehicles", function(req, res) {
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

// NEW
app.get("/vehicles/new", function(req, res) {
  res.render("vehicles/newVehicle.ejs");
});

// SHOW
app.get("/vehicles/:id", function(req, res) {
  Car.findById(req.params.id).populate("comments").exec(function(err, foundVehicle) {
    if(err) {
      console.log(err);
    } else {
      console.log(foundVehicle);
      res.render("vehicles/show.ejs", {vehicle: foundVehicle});
    }
  });
});

// COMMENTS
app.get("/vehicles/:id/comments/new", function(req, res) {
  // res.send("THIS WILL BE THE COMMENT FORM");
  Car.findById(req.params.id, function(err, foundVehicle) {
    if(err) {console.log(err);}
    else {
        res.render("comments/new.ejs", {vehicle: foundVehicle});
    }
  });
});

app.post("/vehicles/:id/comments", function(req, res) {

  Car.findById(req.params.id, function(err, foundVehicle) {
    if(err) {
      console.log(err);
      res.redirect("/vehicles");
    } else {
      console.log(req.body.comment);
      Comment.create(req.body.comment, function(err, comment) {
        if(err) {
          console.log(err);
        } else {
          foundVehicle.comments.push(comment);
          foundVehicle.save();

          res.redirect("/vehicles/" + foundVehicle._id)
        }
      });
    }
  });
});

app.listen(3000, function() {
  console.log("Now running Cartopia Server");
});
