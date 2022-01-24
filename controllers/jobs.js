const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const Job = require('../models/Job');

const get_all_jobs = async (req, res) => {
	const jobs = await Job.find({ createdBy: req.user.user_id }).sort(
		'createdAt'
	);
	res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const get_job = async (req, res) => {
	const {
		user: { user_id },
		params: { id: job_id },
	} = req;

	const job = await Job.findOne({
		_id: job_id,
		createdBy: user_id,
	}).sort('createdAt');

	if (!job) {
		throw NotFoundError('No job found');
	}
	res.status(StatusCodes.OK).json({ job });
};

const create_job = async (req, res) => {
	req.body.createdBy = req.user.user_id;
	const job = await Job.create({ ...req.body });
	res.status(StatusCodes.CREATED).json({ message: job });
};

const update_job = async (req, res) => {
	const {
		body: { company, position },
		user: { user_id },
		params: { id: job_id },
	} = req;

	if (!company || !position) {
		throw BadRequestError('Position or company can not be empty');
	}

	const job = await Job.findByIdAndUpdate(
		{
			_id: job_id,
			createdBy: user_id,
		},
		req.body,
		{ new: true, runValidators: true }
	);
	if (!job) {
		throw NotFoundError('No job found');
	}
	res.status(StatusCodes.CREATED).json({ job });
};

const delete_job = async (req, res) => {
	const {
		user: { user_id },
		params: { id: job_id },
	} = req;

	const job = await Job.findOneAndRemove({
		_id: job_id,
		createdBy: user_id,
	});
	if (!job) {
		throw NotFoundError('No job found');
	}
	res.status(StatusCodes.CREATED).json({ message: 'Job deleted successfully' });
};

module.exports = {
	get_all_jobs,
	get_job,
	create_job,
	update_job,
	delete_job,
};
