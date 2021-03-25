import mongoose from 'mongoose';

export function connectDB() {
	mongoose.connect(`${ process.env.DATABASE_URL }`, {
		useCreateIndex: true,
		useNewUrlParser: true, 
		useUnifiedTopology: true
	}).then(() => {
		console.log('Connected to the database...');
	}).catch(error => {
		console.error.bind(console, 'Connection error:');
	});
}