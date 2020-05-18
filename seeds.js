const mongoose = require("mongoose"),
	  Campground = require("./models/campground"),
	  Comment = require("./models/comment");

const data = [
	{
		name : "Lakey Rester",
		image : "https://miro.medium.com/max/1200/1*ZwsuiM48pU22ugmPQq_5vA.jpeg",
		description : "Relaxing Camp by the lake"
	},
	{
	name : "Aestheticamp",
		image : "https://i.pinimg.com/originals/9d/e6/d7/9de6d742298999cb3678116e248202c4.jpg",
		description : "The Aesthetic views of a campsite you'll never get anywhere"
	},
	{
	name : "Classicamp",
		image : "https://i.pinimg.com/236x/be/d8/0e/bed80e20520bfa3b5e57b3aa50f4d2c3.jpg",
		description : "The oldskooler campsite for the nostalgic souls"
	}
	
]


const seedDB = () =>{
	//Remove all Campground
	Campground.remove({}).then(()=>{
	console.log("Removed Campgrounds!")
		//add few CGs
	data.forEach((seed)=>{
			Campground.create(seed).then((campground)=>{
				console.log("Added a campground!");
				Comment.create({
					text : "The place is great , but it needed improvisation",
					author : "Homer"
				}).then((comment)=>{
						campground.comments.push(comment);
						campground.save();
						console.log("Created new comment!");
						}).catch((err)=>{
				console.log(err);
			})
			}).catch((err)=>{
				console.log(err)
			})
	})
	
	}).catch((err)=>{
		console.log(err);
	});
	
	

}

module.exports = seedDB;
