const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter a name'],
		minlength: 2,
		maxlength: 30,
	},
	email: {
		type: String,
		required: [true, 'Please enter an email'],
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please provide a valid email address',
		],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Please enter a password'],
		minlength: 6,
	},
});

UserSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.create_jwt = function () {
	return jwt.sign(
		{ user_id: this._id, name: this.name },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_LIFETIME,
		}
	);
};

UserSchema.methods.comparePassword = async function (canditate_password) {
	const is_match = await bcrypt.compare(canditate_password, this.password);

	return is_match;
};
module.exports = mongoose.model('User', UserSchema);
