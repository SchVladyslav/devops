const User = require("../models/UserModel");

// Using a Dao makes life easier when migrating models.
class UserDao {
	findAll() {
		return await User.find({});
	}

	async findById(id) {
		const user = await User.findById(id);

		if (user.name) {
			const [first, last] = user.name.split(" ");
			user.firstName = first;
			user.lastName = last || "";
			user.name = undefined;
			return await user.save();
		}

		return user;
	}

	saveUser(props) {
		const { firstName, lastName, age, email } = props;
		return new User({ firstName, lastName, age, email }).save();
	}
}

module.exports = new UserDao();
