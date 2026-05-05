import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import type { FastifyError, FastifyInstance } from "fastify";
import Fastify from "fastify";
// import plugin from "fastify-plugin";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

// Configs
import { COOKIE_SECRET } from "./config.js";

// Utils
import { sendResponse } from "./utils/response.utils.js";
import { setupSwagger } from "./utils/swagger.js";

// Routes

// Extend Fastify Types (Must be at the top level)
declare module "fastify" {
	export interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
		io: import("socket.io").Server;
	}
}

// Build the Fastify app
export const buildApp = async (): Promise<FastifyInstance> => {
	const app: FastifyInstance = Fastify({
		logger: { level: "info" },
		trustProxy: true,
	}).withTypeProvider<ZodTypeProvider>();

	// Register Zod compilers to Fastify (so Fastify uses Zod for validation)
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	// For the documentation
	setupSwagger(app);

	// For the CORS
	app.register(fastifyCors, {
		origin: ["http://localhost:5173", "https://knester.com"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	});

	// For the cookies
	app.register(fastifyCookie, {
		secret: COOKIE_SECRET,
	});

	// Socket

	// Global error handler
	app.setErrorHandler(
		(error: FastifyError & { statusCode?: number }, request, reply) => {
			request.log.error(error);
			const statusCode = error.statusCode ?? 500;
			return sendResponse(
				reply,
				statusCode,
				false,
				error.message || "Internal Server Error",
			);
		},
	);

	return app;
};
