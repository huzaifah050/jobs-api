const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const User = require('../models/User');

const auth = async (req, res, next) => {
	// check header

	const auth_header = req.headers.authorization;

	if (!auth_header || !auth_header.startsWith('Bearer ')) {
		throw new UnauthenticatedError('Authentication invalid');
	}

	const token = auth_header.split(' ')[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		console.log('from auth middleware', payload);

		req.user = {
			user_id: payload.user_id,
			name: payload.name,
		};
		next();
	} catch (error) {
		throw new UnauthenticatedError('Not authorized to access this route');
	}
};

module.exports = auth;
