const express = require("express");
const router = express.Router({
    mergeParams: true
});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");
//COMMENTS ROUTES
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id).then((campground) => {
        res.render("comments/new", {
            campground: campground
        });
    }).catch((err) => {
        console.log(err);
    })

});

router.post("/", middleware.isLoggedIn, (req, res) => {
    //look for campgrounds in database 
    Campground.findById(req.params.id).then((campground) => {
        Comment.create(req.body.comment).then((comment) => {
            //add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            req.flash("success", "Comment added!");
            res.redirect("/campgrounds/" + campground._id);
        }).catch((err) => console.log(err));
    }).catch((err) => {
        console.log(err);
    })
});

//EDIT ROUTES
router.get("/:comment_id/edit", (req, res) => {

    Comment.findById(req.params.comment_id).then((foundComment) => {
        res.render("comments/edit", {
            comment: foundComment,
            campground_id: req.params.id
        })
    }).catch((err) => {
        res.redirect("back");
    })
});

//UPDATE ROUTES
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment).then((updatedComment) => {
        console.log(updatedComment);
        res.redirect("/campgrounds/" + req.params.id);
    }).catch((err) => {
        res.redirect("back");
    })
})

//COMMENTS DESTROY 

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id).then(() => {
        res.redirect("/campgrounds/" + req.params.id);
    }).catch((err) => {
        res.redirect("back");
    })
})

module.exports = router;