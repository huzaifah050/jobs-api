const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
	let custom_error = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong try again later',
	};
	// if (err instanceof CustomAPIError) {
	// 	return res.status(err.statusCode).json({ msg: err.message });
	// }

	if (err.name === 'CastError') {
		custom_error.msg = `No item found for ${err.value}`;
		custom_error.statusCode = 404;
	}
	if (err.name === 'ValidationError') {
		custom_error.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(',  ');
		custom_error.statusCode = 400;
	}
	if (err.code && err.code === 11000) {
		custom_error.msg = `Duplicate value entered for ${Object.keys(
			err.keyValue
		)} field, please choose another value`;
		custom_error.statusCode = 400;
	}
	// return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
	return res.status(custom_error.statusCode).json({ msg: custom_error.msg });
};

module.exports = errorHandlerMiddleware;
