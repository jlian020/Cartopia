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
      console.log(err);
      return res.render("register.ejs")
    }
    passport.authenticate("local")(req, res, function() {
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
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

module.exports = router;
