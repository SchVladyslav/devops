const { Schema, model } = require('mongoose');

const userSchema = new Schema({
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	firstName: { type: String, required: false },
	lastName: { type: String, required: false },
	name: { type: String, required: false },
	createdAt: { type: Date, default: Date.now },
});

module.exports = model('User', userSchema);
