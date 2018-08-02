var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get("/", function(req, res) {
  // res.send("This is the landing page");
  res.render("landing.ejs");
});

// AUTHORIZATION ROUTES //
router.get("/register", function(req, res) {
  res.render("register.ejs");
})

router.post("/register", function(req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if(err) {
      req.flash("error", err.message);
      res.redirect("/register")
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome to Cartopia, You have logged in!");
      res.redirect("/vehicles");
    });
  });
});

router.get("/login", function(req, res) {
  res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function(req,res) {
});

router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "Logged You Out!");
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please Log In First!");
  res.redirect("/login");
}

module.exports = router;
