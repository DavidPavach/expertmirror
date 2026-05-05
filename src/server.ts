import mongoose from "mongoose";
import { buildApp } from "./app.js";

//Config
import { DATABASE_URL, PORT } from "./config.js";

const startServer = async () => {
	const app = await buildApp();

	async function connectToDatabase() {
		try {
			await mongoose.connect(DATABASE_URL);
			app.log.info("MongoDB connected");
		} catch (err) {
			app.log.error(err);
			process.exit(1);
		}
	}

	try {
		await connectToDatabase();
		await app.listen({ port: PORT, host: "0.0.0.0" });
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

startServer();
