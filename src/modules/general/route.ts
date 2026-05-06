import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { isSuspended } from "../../middlewares/security.js";
import * as GeneralHandlers from "./controller.js";
import { type PresignRequestInput, presignItemSchema } from "./schema.js";

// Schemas

export default async function generalRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Get Presigned Urls
	appWithZod.post<{ Body: PresignRequestInput }>(
		"/presigned",
		{
			preHandler: [app.authenticate, isSuspended],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["General"],
				body: presignItemSchema,
			},
		},
		GeneralHandlers.GetPresignedUrlsHandler,
	);
}
