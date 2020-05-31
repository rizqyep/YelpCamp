const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middlewareObject = {}

middlewareObject.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in !");
    res.redirect("/login");

}
middlewareObject.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id).then((foundComment) => {
            if (comment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You dont have any permission");
                res.redirect("back");
            }
        }).catch((err) => {
            req.flash("error", "Comment not found");
        })
    } else {
        req.flash("error", "You need to be logged in!");
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
                    req.flash("error", "You dont have any permission");
                    res.redirect("back");
                }
            })
            .catch((err) => {
                req.flash("error", "Campground not found");
                res.redirect("back");
            });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
}

module.exports = middlewareObject;