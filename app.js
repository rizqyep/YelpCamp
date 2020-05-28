const express = require("express"),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  flash = require("connect-flash"),
  methodOverride = require("method-override"),
  User = require("./models/user"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  seedDB = require("./seeds");

const commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

//PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Rep will rule the it world",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
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


// seedDB(); //seed db


app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);


app.listen(3000, "0.0.0.0", () => {
  console.log("YelpCamp Server started at port 3000");
});