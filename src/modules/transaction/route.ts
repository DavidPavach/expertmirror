import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import * as TransactionHandlers from "./controller.js";

// Schemas

export default async function transactionRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Get Presigned Urls
	appWithZod.get(
		"/prices",
		{
			preHandler: [app.authenticate],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Transactions"],
			},
		},
		TransactionHandlers.FetchPricesHandler,
	);
}
