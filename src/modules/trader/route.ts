import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { isSuperAdmin } from "../../middlewares/security.js";
import {
	type IdInput,
	idSchema,
	type PaginationInput,
	paginationSchema,
} from "../general/schema.js";
import * as TradersHandlers from "./controller.js";
import {
	type CreateCopyInput,
	createCopySchema,
	type UpdateCopyInput,
	updateCopySchema,
} from "./schema.js";

export default async function traderRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Fetch all Traders
	appWithZod.get<{ Querystring: PaginationInput }>(
		"/all",
		{
			preHandler: [app.authenticate],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Traders"],
				querystring: paginationSchema,
			},
		},
		TradersHandlers.GetAllCopiesHandler,
	);

	// Fetch a Trader
	appWithZod.get<{ Params: IdInput }>(
		"/trader/:id",
		{
			preHandler: [app.authenticate],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Traders"],
				params: idSchema,
			},
		},
		TradersHandlers.GetCopyHandler,
	);

	// Admin

	// Create Trader
	appWithZod.post<{ Body: CreateCopyInput }>(
		"/new",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Traders"],
				body: createCopySchema,
			},
		},
		TradersHandlers.CreateCopyHandler,
	);

	// Update Trader
	appWithZod.patch<{ Params: IdInput; Body: UpdateCopyInput }>(
		"/update/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Traders"],
				body: updateCopySchema,
				params: idSchema,
			},
		},
		TradersHandlers.UpdateCopyHandler,
	);

	// Delete Trader
	appWithZod.delete<{ Params: IdInput }>(
		"/delete/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Traders"],
				params: idSchema,
			},
		},
		TradersHandlers.DeleteCopyHandler,
	);
}
