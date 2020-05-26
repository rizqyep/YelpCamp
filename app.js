const express = require("express"),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  User = require("./models/user"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment");
seedDB = require("./seeds");

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Rep will rule the it world",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/yelp_camp_v6", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})
app.set("view engine", "ejs");


seedDB();


const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");

}


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


//COMMENTS ROUTES
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
  Campground.findById(req.params.id).then((campground) => {
    res.render("comments/new", {
      campground: campground
    });
  }).catch((err) => {
    console.log(err);
  })

});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
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


//AUTH ROUTES

//REGISTER ROUTES
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  let newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/campgrounds");
    });
  })
});

//LOGIN ROUTES
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), (req, res) => {

});

//LOGOUT
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
})



app.listen(3000, "0.0.0.0", () => {
  console.log("YelpCamp Server started at port 3000");
});