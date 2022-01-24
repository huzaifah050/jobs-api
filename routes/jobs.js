const express = require('express');
const {
	get_all_jobs,
	create_job,
	get_job,
	update_job,
	delete_job,
} = require('../controllers/jobs');
const router = express.Router();

router.route('/').get(get_all_jobs).post(create_job);
router.route('/:id').get(get_job).patch(update_job).delete(delete_job);

module.exports = router;
