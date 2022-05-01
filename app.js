const express = require("express");
const User = require("./UserModel");
const app = express();

app.use(express.json());

app.post("/api/v1/users", async (req, res) => {
	const { name, age } = req.body;
	const user = await new User({ name, age }).save();

	res.json(user);
})

app.get("/api/v1/users", async (req, res) => {
	const users = await User.find({});

	res.json(users);
})

// Adding a property creates a inconsistent model
// We can solve this problem with a migration job
app.post("/api/v2/users", async (req, res) => {
	const { name, age, email } = req.body;
	const user = await new User({ name, age, email }).save();

	res.json(user);
})

// In version 3 we push models with an updated structure as well.
// But what if we can't run a migration job?
app.post("/api/v3/users", async (req, res) => {
	const { firstName, lastName, age, email } = req.body;
	const user = await new User({ firstName, lastName, age, email }).save();

	res.json(user);
})

// If we can't stop the system to run a migration job a slower migration strategy is needed.
// The following code is an example of migrating each user as they use the system
app.get("/api/v3/users/:id", async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user.name) {
		const [first, last] = user.name.split(" ");
		user.firstName = first;
		user.lastName = last || "";
		user.name = undefined;
		await user.save();
	}

	res.json(user);
})

module.exports = app;
