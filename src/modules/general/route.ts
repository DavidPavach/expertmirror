import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import * as GeneralHandlers from "./controller.js";
import { type PresignRequestInput, presignRequestSchema } from "./schema.js";

export default async function generalRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Get Presigned Urls
	appWithZod.post<{ Body: PresignRequestInput }>(
		"/presigned",
		{
			preHandler: [app.authenticate],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["General"],
				body: presignRequestSchema,
			},
		},
		GeneralHandlers.GetPresignedUrlsHandler,
	);
}
