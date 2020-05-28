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
router.post("/", isLoggedIn, (req, res) => {
    //get data from form
    const name = req.body.name;
    const image = req.body.imageurl;
    const desc = req.body.description;
    const author = {
        id: req.user.id,
        username: req.user.username
    }

    const newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author
    };
    Campground.create(
        newCampground
    ).then((err, newlyCreated) => {
        console.log(newlyCreated);
        res.redirect("/campgrounds");

    }).catch((err) => {
        console.log(err);
    })
    //back to get route of campgrounds

});

//CREATE CAMPGROUND FORM
router.get("/new", isLoggedIn, (req, res) => {
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

router.get("/:id/edit", (req, res) => {
    Campground.findById(req.params.id).then((foundCampground) => {
        res.render("campgrounds/edit", {
            campground: foundCampground
        });
    }).catch((err) => {
        console.log(err);
        res.redirect("/campgprounds");
    })
})
module.exports = router;