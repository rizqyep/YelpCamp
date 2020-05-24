const mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment");

const data = [{
		name: "Lakey Rester",
		image: "https://miro.medium.com/max/1200/1*ZwsuiM48pU22ugmPQq_5vA.jpeg",
		description: "Relaxing Camp by the lake,fulfilled with enormous landscape which would reveal your inner peace and could also bring bright idea come into life"
	},
	{
		name: "Aestheticamp",
		image: "https://i.pinimg.com/originals/9d/e6/d7/9de6d742298999cb3678116e248202c4.jpg",
		description: "The Aesthetic views of a campsite you'll never get anywhere, complete with all the nice view, minimalistic feels inside, you will never find yourself anyting warmer, believe in us, visit us, but all the joy are yours"
	},
	{
		name: "Classicamp",
		image: "https://i.pinimg.com/236x/be/d8/0e/bed80e20520bfa3b5e57b3aa50f4d2c3.jpg",
		description: "The oldskooler campsite for the nostalgic souls, bring back all that memories of going hike back in 80s,90s, bring your camping fellas to makes the situation even more real, time will sure travel when you are here with your buddies."
	}

]


const seedDB = () => {
	//Remove all Campground
	Campground.remove({}).then(() => {
		console.log("Removed Campgrounds!")
		//add few CGs
		data.forEach((seed) => {
			Campground.create(seed).then((campground) => {
				console.log("Added a campground!");
				Comment.create({
					text: "The place is great , but it needed improvisation",
					author: "Homer"
				}).then((comment) => {
					campground.comments.push(comment);
					campground.save();
					console.log("Created new comment!");
				}).catch((err) => {
					console.log(err);
				})
			}).catch((err) => {
				console.log(err)
			})
		})

	}).catch((err) => {
		console.log(err);
	});



}

module.exports = seedDB;