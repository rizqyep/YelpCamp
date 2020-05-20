const express = require("express"),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require("body-parser"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment");
seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp_v3", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");


seedDB();


app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  //get Campgrounds from db
  Campground.find({}).then((campgrounds) => {
    res.render("campgrounds/index", {
      campgrounds: campgrounds
    })
  }).catch((err) => {
    console.log(err);
  })

});

app.post("/campgrounds", (req, res) => {
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

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", (req, res) => {
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
})

app.get("/campgrounds/:id/comments/new", (req, res) => {
  Campground.findById(req.params.id).then((campground) => {
    res.render("comments/new", {
      campground: campground
    });
  }).catch((err) => {
    console.log(err);
  })

});

app.post("/campgrounds/:id/comments", (req, res) => {
  //look for campgrounds in database 
  Campground.findById(req.params.id).then((campground) => {
    Comment.create(req.body.comment).then((comment) => {
      campground.comments.push(comment);
      campground.save();
      res.redirect("/campgrounds/" + campground._id);
    }).catch((err) => console.log(err));
  }).catch((err) => {
    console.log(err);
  })
})




app.listen(3000, "0.0.0.0", () => {
  console.log("YelpCamp Server started at port 3000");
});