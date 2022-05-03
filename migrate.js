require("dotenv").config();
const UserDao = require('./dtos/UserDao');
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

const userDAO = async () => {
	try {
		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}, () => {
			console.log('Connected to MongoDB');
		});

		await UserDao.findById('626ea19324bc0d81ae0f460b');

		mongoose.disconnect(() => console.log('Disconnected from MongoDB'));
	} catch (error) {
		console.log(error);
	}
};

userDAO();
