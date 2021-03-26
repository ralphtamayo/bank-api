import express, { Express } from 'express';
import http from 'http';

import { config } from 'dotenv';

import { connectDB } from './db-connect';
import { initRoutes } from '../routes';

export class TestUtils {
	private static app: Express = express();
	private static server: http.Server;

	static runServer() {
		config();

		// Initialize routes
		initRoutes(this.app);
		
		// Connect to the database
		connectDB();

		// Server the app
		this.server = this.app .listen(5000, () => {
			console.log('Server is listening on port 5000');
		});
	}

	static getApp() {
		return this.app;
	}

	static closeServer() {
		this.server.close();
	}
}