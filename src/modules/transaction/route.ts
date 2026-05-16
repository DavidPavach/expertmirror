import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	isAdmin,
	isSuperAdmin,
	isSuspended,
} from "../../middlewares/security.js";
import { type IdInput, idSchema } from "../general/schema.js";
import * as TransactionHandlers from "./controller.js";
import {
	type AdminTransactionInput,
	adminTransactionSchema,
	type TransactionQueryInput,
	transactionQuerySchema,
	type UpdateTransactionInput,
	type UserTransactionInput,
	updateTransactionSchema,
	userTransactionSchema,
} from "./schema.js";

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

	// New Transaction
	appWithZod.post<{ Body: UserTransactionInput }>(
		"/new",
		{
			preHandler: [app.authenticate, isSuspended],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Transactions"],
				body: userTransactionSchema,
			},
		},
		TransactionHandlers.NewTransactionHandler,
	);

	// Get User Transactions Handler
	appWithZod.get<{ Querystring: TransactionQueryInput }>(
		"/get",
		{
			preHandler: [app.authenticate],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Transactions"],
				querystring: transactionQuerySchema,
			},
		},
		TransactionHandlers.GetMyTransactionsHandler,
	);

	// Get Dashboard Stats
	appWithZod.get(
		"/dashboard",
		{
			preHandler: [app.authenticate],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Transactions"],
			},
		},
		TransactionHandlers.GetUserDashboardHandler,
	);

	// Admin Routes

	// New Admin Transaction
	appWithZod.post<{ Params: IdInput; Body: AdminTransactionInput }>(
		"/newTx/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Transactions"],
				body: adminTransactionSchema,
				params: idSchema,
			},
		},
		TransactionHandlers.AdminCreateTransactionHandler,
	);

	// Get All Transactions
	appWithZod.get<{ Querystring: TransactionQueryInput }>(
		"/getAll",
		{
			preHandler: [app.authenticate, isAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Transactions"],
				querystring: transactionQuerySchema,
			},
		},
		TransactionHandlers.AdminGetAllTransactionsHandler,
	);

	// Update Transaction
	appWithZod.patch<{ Params: IdInput; Body: UpdateTransactionInput }>(
		"/update/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Transactions"],
				body: updateTransactionSchema,
				params: idSchema,
			},
		},
		TransactionHandlers.AdminUpdateTransactionHandler,
	);

	// Delete Transaction
	appWithZod.delete<{ Params: IdInput }>(
		"/delete/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Transactions"],
				params: idSchema,
			},
		},
		TransactionHandlers.AdminDeleteTransactionHandler,
	);
}
