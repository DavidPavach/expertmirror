import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import type { FastifyError, FastifyInstance } from "fastify";
import Fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

// Configs and Routes
import { COOKIE_SECRET } from "./config.js";
import { authPlugin } from "./middlewares/auth.js";
import adminRoutes from "./modules/admin/route.js";
import authRoutes from "./modules/auth/route.js";
import generalRoutes from "./modules/general/route.js";
import kycRoutes from "./modules/kyc/route.js";
import referralRoutes from "./modules/referral/routes.js";
import userRoutes from "./modules/user/route.js";

// Utils
import { sendResponse } from "./utils/response.utils.js";
import { setupSwagger } from "./utils/swagger.js";

// Extend Fastify Types (Must be at the top level)
declare module "fastify" {
	export interface FastifyInstance {
		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;
		io: import("socket.io").Server;
	}

	interface FastifyRequest {
		user: {
			id: string;
			type: "User" | "Admin";
		};
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
		origin: ["http://localhost:5173", "https://expertmirrorcon.com"],
		credentials: true,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	});

	// For the cookies
	app.register(fastifyCookie, {
		secret: COOKIE_SECRET,
	});

	// Register the Decorators(Middlewares)
	app.register(authPlugin);

	// Routes
	app.register(userRoutes, { prefix: "/v1/api/users" });
	app.register(authRoutes, { prefix: "/v1/api/auth" });
	app.register(adminRoutes, { prefix: "/v1/api/admins" });
	app.register(generalRoutes, { prefix: "/v1/api/general" });
	app.register(kycRoutes, { prefix: "/v1/api/kyc" });
	app.register(referralRoutes, { prefix: "/v1/api/referral" });

	// Socket

	// Health Check Endpoint
	app.get("/health", async () => {
		return { status: "OK" };
	});

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
