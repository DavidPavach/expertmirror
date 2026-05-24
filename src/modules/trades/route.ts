import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
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
import * as TradeControllers from "./controller.js";
import {
	type CloseTradeInput,
	type CreateTradeInput,
	closeTradeSchema,
	createTradeSchema,
} from "./schema.js";

export default async function tradeRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Create (Open) new Trades
	appWithZod.post<{ Body: CreateTradeInput }>(
		"/new",
		{
			preHandler: [app.authenticate, isSuspended],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Trades"],
				body: createTradeSchema,
			},
		},
		TradeControllers.OpenTradeHandler,
	);

	// Fetch User Trades
	appWithZod.get<{ Querystring: PaginationInput }>(
		"/get",
		{
			preHandler: [app.authenticate, isUser],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Trades"],
				querystring: paginationSchema,
			},
		},
		TradeControllers.GetUserTradeHandler,
	);

	// Admin

	// Close a Trade
	appWithZod.patch<{ Params: IdInput; Body: CloseTradeInput }>(
		"/close",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Trades"],
				params: idSchema,
				body: closeTradeSchema,
			},
		},
		TradeControllers.CloseTradeHandler,
	);

	// Delete a Trade
	appWithZod.delete<{ Params: IdInput }>(
		"/delete",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Trades"],
				params: idSchema,
			},
		},
		TradeControllers.DeleteTradeHandler,
	);

	// Fetch All Trades
	appWithZod.get<{ Querystring: PaginationInput }>(
		"/getAll",
		{
			preHandler: [app.authenticate, isUser],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Trades"],
				querystring: paginationSchema,
			},
		},
		TradeControllers.GetAllTradeHandler,
	);
}
