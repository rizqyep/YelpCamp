const express = require("express"),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

//Schema Setup 
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//   name: "Lhok Keutapang",
//   image: "https://4.bp.blogspot.com/-tA5I_ZadriE/U_OYF0BYLvI/AAAAAAAABm0/MFCAXEWKuiU/s1600/keutapang6.jpg",
//   description: "Hidden pretty beach located somewhre"
// });


app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  //get Campgrounds from db
  Campground.find({}).then((campgrounds) => {
    res.render("index", {
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
  res.render("new");
});

app.get("/campgrounds/:id", (req, res) => {
  //find campground id 
  const id = req.params.id;
  Campground.findById(id).then(
    (foundCampground) => {
      res.render("show", {
        campground: foundCampground
      });
    }
  ).catch((err) => {
    console.log(err);
  })

})

app.listen(3000, "0.0.0.0", () => {
  console.log("YelpCamp Server started at port 3000");
});