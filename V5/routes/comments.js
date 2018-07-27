var express = require('express');
var router = express.Router({mergeParams: true});
var Car = require('../models/vehicle');
var Comment = require('../models/comment');

// COMMENTS
router.get("/new", isLoggedIn, function(req, res) {
  // res.send("THIS WILL BE THE COMMENT FORM");
  Car.findById(req.params.id, function(err, foundVehicle) {
    if(err) {console.log(err);}
    else {
        res.render("comments/new.ejs", {vehicle: foundVehicle});
    }
  });
});

router.post("/", isLoggedIn, function(req, res) {

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
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();

          foundVehicle.comments.push(comment);
          foundVehicle.save();

          res.redirect("/vehicles/" + foundVehicle._id)
        }
      });
    }
  });
});

// EDIT COMMENT
router.get("/:comment_id/edit", checkOwnership, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if(err) {
      res.redirect("back");
    } else {
      res.render("comments/edit.ejs", {vehicle_id: req.params.id, comment: foundComment});
    }
  });
});

router.put("/:comment_id", checkOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if(err) {
      res.redirect("back");
    } else {
      res.redirect("/vehicles/" + req.params.id);
    }
  });
});

// DELETE COMMENT
router.delete("/:comment_id", checkOwnership, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if(err) {
      res.redirect("back");
    } else {
      res.redirect("/vehicles/" + req.params.id);
    }
  })
});

// MIDDLEWARE

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkOwnership(req, res, next) {
  if(req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if(err) {
        res.redirect("back");
      } else {
        if(foundComment.author.id.equals(req.user._id)) {
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
