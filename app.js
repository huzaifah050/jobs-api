require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//Security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//Routes imports
const auth_routes = require('./routes/auth');
const job_routes = require('./routes/jobs');
const connectDB = require('./db/connect');
const auth = require('./middleware/authentication');

// extra packages
app.set('trust  proxy', 1);
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 100,
	})
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// routes
app.get('/', (req, res) => {
	res.send('heloo');
});

app.use('/api/v1/auth', auth_routes);
app.use('/api/v1/jobs', auth, job_routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3001;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
