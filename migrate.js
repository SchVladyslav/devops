const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI || "mongodb://0.0.0.0:27017/app", {
	useNewUrlParser: true,
})

const User = require("./src/UserModel");

(async () => {
	await User.updateMany(
		{ email: { $exists: false } },
		{ $set: { email: "migrated@local" } }
	);
	mongoose.disconnect();
})