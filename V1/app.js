var express = require('express');
var app = express();

app.get("/", function(req, res) {
  // res.send("This is the landing page");
  res.render("landing.ejs");
});

app.get("/vehicles", function(req, res) {
  var vehicles = [
    {name: "Lamborghini Aventador", img: "https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/share%20img/aventador-sv-facebook-og.jpg"},
    {name: "Lamborghini Huracon", img: "https://s3.caradvice.com.au/thumb/960/500/wp-content/uploads/2018/01/lamborghini_huracan_performante_review_hero.jpg"},
    {name: "Tesla Model X ", img: "https://www.teslamagazin.sk/wp-content/uploads/2018/02/tesla-model-x-p100d-specifikacie.jpg"},
    {name: "Aston Martin DB11", img: "https://st.motortrend.com/uploads/sites/10/2016/10/2017-Aston-Martin-DB11-front-three-quarter-16.jpg"}
    // {name: "BMW i8", img: ""},
    // {name: "Rolls Royce Phantom", img: ""},
    // {name: "Tesla Model S", img: ""}
  ];
  
  res.render("vehicles.ejs", {vehicles: vehicles});
});

app.listen(3000, function() {
  console.log("Now running Cartopia Server");
});
