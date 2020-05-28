const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middlewareObject = {}

middlewareObject.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");

}
middlewareObject.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id).then((foundComment) => {
            if (comment.author.id.equals(req.user._id)) {
                next();
            }
        }).catch((err) => {
            res.redirect("back");
        })
    } else {
        res.redirect("back");
    }
}

middlewareObject.checkCampgroundOwnership = (req, res, next) => {
    //check log in status
    if (req.isAuthenticated()) {
        //check cg owner
        Campground.findById(req.params.id)
            .then((foundCampground) => {
                console.log(req.user._id);
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            })
            .catch((err) => {
                console.log(err);
                res.redirect("back");
            });
    } else {
        res.redirect("back");
    }
}

module.exports = middlewareObject;