require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/user.model");

const start = async () => {
	try {
		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}, () => {
			console.log('Connected to MongoDB');
		});

		await User.updateMany(
			{ name: { $exists: false } },
			{ $set: { name: "migrationName" } }
		);

		mongoose.disconnect(() => console.log('Disconnected from MongoDB'));
	} catch (error) {
		console.log(error);
	}
};

start();
