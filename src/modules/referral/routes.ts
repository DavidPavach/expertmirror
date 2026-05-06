import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { isAdmin, isUser } from "../../middlewares/security.js";
import { type PaginationInput, paginationSchema } from "../general/schema.js";
import * as ReferralHandlers from "./controller.js";

// Schemas

export default async function referralRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Get Users Referral
	appWithZod.post<{ Querystring: PaginationInput }>(
		"/fetch",
		{
			preHandler: [app.authenticate, isUser],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Referrals"],
				querystring: paginationSchema,
			},
		},
		ReferralHandlers.GetMyReferralsHandler,
	);

	// Admin
	appWithZod.post<{ Querystring: PaginationInput }>(
		"/fetch/all",
		{
			preHandler: [app.authenticate, isAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Referrals"],
				querystring: paginationSchema,
			},
		},
		ReferralHandlers.GetAllReferralsHandler,
	);
}
