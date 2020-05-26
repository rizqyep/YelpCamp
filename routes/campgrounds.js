const express = require("express");
const router = express.Router({
    mergeParams: true
});
const Campground = require("../models/campground");
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");

}
//SHOW ALL CAMPGROUNDS
router.get("/", (req, res) => {
    //get Campgrounds from db

    Campground.find({}).then((campgrounds) => {
        res.render("campgrounds/index", {
            campgrounds: campgrounds
        })
    }).catch((err) => {
        console.log(err);
    })

});


//CREATE NEW CAMPGROUND
router.post("/", (req, res) => {
    //get data from form

    let name = req.body.name;
    let image = req.body.imageurl;
    let desc = req.body.description;
    Campground.create({
        name: name,
        image: image,
        description: desc
    }).then((err, newlyCreated) => {
        res.redirect("/campgrounds");
    }).catch((err) => {
        console.log(err);
    })
    //back to get route of campgrounds

});

//CREATE CAMPGROUND FORM
router.get("/new", (req, res) => {
    res.render("campgrounds/new");
});

//SHOW EACH CAMPGROUND BY ID
router.get("/:id", (req, res) => {
    //find campground id 
    const id = req.params.id;
    Campground.findById(id).populate("comments").exec(
        (err, foundCampground) => {
            if (err) {
                console.log(err);
            } else {
                console.log(foundCampground);
                res.render("campgrounds/show", {
                    campground: foundCampground
                });
            }
        });
});
module.exports = router;