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
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    fs = require('fs'),
    path = require('path');

var vehicleRoutes = require('./routes/vehicles'),
    commentRoutes = require('./routes/comments'),
    indexRoutes = require('./routes/index');

// mongoose.connect("mongodb://localhost:27017/Cartopia", { useNewUrlParser: true });
// mongoose.connect("mongodb://david:junhao13@ds139970.mlab.com:39970/cartopia");
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();

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

// SENDS req.user to every EJS
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
})

app.use("/vehicles", vehicleRoutes);
app.use("/vehicles/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT || 3000, function() {
  console.log("Now running Cartopia Server");
});
