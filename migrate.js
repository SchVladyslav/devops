const mongoose = require("mongoose");

const User = require("./models/user.model");

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await User.updateMany(
			{ name: { $exists: false } },
			{ $set: { name: "migrationName" } }
		);

		mongoose.disconnect();
  } catch (error) {
    console.log(error);
  }
};

start();
