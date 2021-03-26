import express from 'express';

import 'dotenv/config';

import { initRoutes } from './routes';
import { connectDB } from './utils/db-connect';

const app = express();

// Initialize routes
initRoutes(app);

// Connect to the database
connectDB();

// Serve the app
app.listen(3000, () => {
	console.log('Server is listening on port 3000');
});

export default app;