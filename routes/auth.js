
const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// AUTH routes
// show the regi form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

// handle sign up logic
router.post("/register", function(req, res){
    const newUser = new User({
        username: req.body.username, 
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message);
            return res.redirect("/register")
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome, " + user.username);
            res.redirect("/campground");
        });
    });
})

// login route
router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

// handle login request
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campground", 
    failureRedirect: "/login"

}), function(req, res){ });

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Bye, have a nice day!")
    res.redirect("/campground");
})


// user profile
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if (err || !foundUser){
            req.flash("error", "User not found!");
            res.redirect("/");
        } else {
            res.render("users/show", {user: foundUser});
        }
    });
});


module.exports = router;