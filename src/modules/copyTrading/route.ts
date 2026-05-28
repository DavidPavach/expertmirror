import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	isAdmin,
	isSuperAdmin,
	isSuspended,
	isUser,
} from "../../middlewares/security.js";
import {
	type IdInput,
	idSchema,
	type PaginationInput,
	paginationSchema,
} from "../general/schema.js";
import * as CopyTradingHandlers from "./controller.js";
import {
	type CopyIdInput,
	copyIdSchema,
	type RemoveEntryInput,
	removeEntrySchema,
	type StartCopyingInput,
	startCopyingSchema,
	type UpdateCopyStatsInput,
	type UpdateEntryInput,
	updateCopyStatsSchema,
	updateEntrySchema,
} from "./schema.js";

export default async function copyTradingRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Create (Open) new copy Trading
	appWithZod.post<{ Body: StartCopyingInput }>(
		"/new",
		{
			preHandler: [app.authenticate, isSuspended],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Copy"],
				body: startCopyingSchema,
			},
		},
		CopyTradingHandlers.StartCopyTradeHandler,
	);

	// Get a Users Copy Trading
	appWithZod.get(
		"/get",
		{
			preHandler: [app.authenticate, isUser],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Copy"],
			},
		},
		CopyTradingHandlers.GetMyCopyTradesHandler,
	);

	// Stop a Copy Trading
	appWithZod.patch<{ Params: IdInput }>(
		"/stop/:id",
		{
			preHandler: [app.authenticate],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Copy"],
				params: idSchema,
			},
		},
		CopyTradingHandlers.StopCopyTraderHandler,
	);

	// Admin

	// Update a Copy Trading
	appWithZod.patch<{ Params: IdInput; Body: UpdateCopyStatsInput }>(
		"/update/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Copy"],
				params: idSchema,
				body: updateCopyStatsSchema,
			},
		},
		CopyTradingHandlers.UpdateCopyTradeHandler,
	);

	// Get All Copy Tradings
	appWithZod.get<{ Querystring: PaginationInput }>(
		"/getAll",
		{
			preHandler: [app.authenticate, isAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Copy"],
				querystring: paginationSchema,
			},
		},
		CopyTradingHandlers.GetAllCopyTradings,
	);

	// Delete Entry
	appWithZod.delete<{ Body: RemoveEntryInput }>(
		"/removeEntry",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Copy"],
				body: removeEntrySchema,
			},
		},
		CopyTradingHandlers.RemoveCopyEntryHandler,
	);

	// Update Entry
	appWithZod.patch<{
		Params: CopyIdInput;
		Body: UpdateEntryInput;
	}>(
		"/updateEntry/:copyTradingId/:entryId",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Copy"],
				params: copyIdSchema,
				body: updateEntrySchema,
			},
		},
		CopyTradingHandlers.UpdateCopyEntryHandler,
	);
}
