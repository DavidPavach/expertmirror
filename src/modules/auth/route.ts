import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

// Handlers
import * as AuthHandlers from "./controller.js";

// Schemas
import { type LoginInput, loginSchema } from "./schema.js";

export default async function authRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Authenticate a User
	appWithZod.post<{ Body: LoginInput }>(
		"/login",
		{
			schema: {
				tags: ["Auth"],
				body: loginSchema,
			},
		},
		AuthHandlers.LoginHandler,
	);

	// Log Out
	appWithZod.post(
		"/logout",
		{
			preHandler: [app.authenticate],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Auth"],
			},
		},
		AuthHandlers.LogoutHandler,
	);

	// Admin

	// Admin Authentication
	appWithZod.post<{ Body: LoginInput }>(
		"/operations",
		{
			schema: {
				tags: ["Auth"],
				body: loginSchema,
			},
		},
		AuthHandlers.AuthAdminHandler,
	);
}
