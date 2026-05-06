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
import * as KYCHandlers from "./controller.js";
import {
	type CreateKycInput,
	createKycSchema,
	type UpdateKycInput,
	updateKycSchema,
} from "./schema.js";

export default async function kycRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Handle a User KYC
	appWithZod.post<{ Body: CreateKycInput }>(
		"/create",
		{
			preHandler: [app.authenticate, isSuspended],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["KYCs"],
				body: createKycSchema,
			},
		},
		KYCHandlers.SubmitKycHandler,
	);

	// Get User KYC
	appWithZod.get(
		"/fetch/user",
		{
			preHandler: [app.authenticate, isUser],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["KYCs"],
			},
		},
		KYCHandlers.FetchKycHandler,
	);

	// Admin Routes

	// Fetch all KYC
	appWithZod.get<{ Querystring: PaginationInput }>(
		"/fetch/user/all",
		{
			preHandler: [app.authenticate, isAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["KYCs"],
				querystring: paginationSchema,
			},
		},
		KYCHandlers.GetAllKycsHandler,
	);

	// Fetch a User KYC
	appWithZod.get<{ Params: IdInput }>(
		"/fetch/user/:id",
		{
			preHandler: [app.authenticate, isAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["KYCs"],
				params: idSchema,
			},
		},
		KYCHandlers.FetchAUserKycHandler,
	);

	// Update User KYC
	appWithZod.patch<{ Params: IdInput; Body: UpdateKycInput }>(
		"/update/user/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["KYCs"],
				params: idSchema,
				body: updateKycSchema,
			},
		},
		KYCHandlers.UpdateKycHandler,
	);

	// Delete User KYC
	appWithZod.patch<{ Params: IdInput }>(
		"/delete/user/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["KYCs"],
				params: idSchema,
			},
		},
		KYCHandlers.DeleteKycHandler,
	);
}
