const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');

const register = async (req, res) => {
	const user = await User.create({ ...req.body });
	const token = user.create_jwt();
	res.status(StatusCodes.CREATED).json({ token, user: { name: user.name } });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		throw new BadRequestError('Please enter a valid email or password');
	}
	const user = await User.findOne({ email });

	if (!user) {
		throw new UnauthenticatedError('Invalid credentials');
	}
	const is_password_correct = await user.comparePassword(password);

	if (!is_password_correct) {
		throw new UnauthenticatedError('Invalid credentials');
	}
	const token = user.create_jwt();
	res.status(StatusCodes.OK).json({ token, user: { name: user.name } });
};

module.exports = {
	register,
	login,
};
