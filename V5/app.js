var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Car = require('./models/vehicle'),
    Comment = require('./models/comment'),
    User = require('./models/user'),
    seedDB = require('./seed'),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb://localhost:27017/Cartopia", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(__dirname + "/public"));
seedDB();

// SETUP PASSPORT //
app.use(require("express-session") ({
  secret: "Johnny Situ is smelly haha",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
})
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
app.get("/vehicles/:id/comments/new", isLoggedIn, function(req, res) {
  // res.send("THIS WILL BE THE COMMENT FORM");
  Car.findById(req.params.id, function(err, foundVehicle) {
    if(err) {console.log(err);}
    else {
        res.render("comments/new.ejs", {vehicle: foundVehicle});
    }
  });
});

app.post("/vehicles/:id/comments", isLoggedIn, function(req, res) {

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

// AUTHORIZATION ROUTES //
app.get("/register", function(req, res) {
  res.render("register.ejs");
})

app.post("/register", function(req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if(err) {
      console.log(err);
      return res.render("register.ejs")
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/vehicles");
    });
  });
});

app.get("/login", function(req, res) {
  res.render("login.ejs");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function(req,res) {
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

app.listen(3000, function() {
  console.log("Now running Cartopia Server");
});
