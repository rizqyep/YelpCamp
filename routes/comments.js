const express = require("express");
const router = express.Router({
    mergeParams: true
});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");

}
//COMMENTS ROUTES
router.get("/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id).then((campground) => {
        res.render("comments/new", {
            campground: campground
        });
    }).catch((err) => {
        console.log(err);
    })

});

router.post("/", isLoggedIn, (req, res) => {
    //look for campgrounds in database 
    Campground.findById(req.params.id).then((campground) => {
        Comment.create(req.body.comment).then((comment) => {
            //add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
        }).catch((err) => console.log(err));
    }).catch((err) => {
        console.log(err);
    })
})

module.exports = router;