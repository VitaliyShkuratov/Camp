var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

// root route
router.get("/", function(req, res){
    res.render("landing");    
});

// show register form
router.get("/register", function(req, res) {
    res.render("register");    
});
// sing up route
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        })
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// login route
router.post("/login", 
        passport.authenticate(
            "local",
            {
                successRedirect: "/campgrounds",
                failureRedirect: "/login" 
            }),
        function(req, res) {
    res.send("You just login");
});

// logout rout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

// middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;