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
import * as UserHandlers from "./controller.js";
import {
	type AdminSuspendInput,
	type AdminUpdateUserInput,
	adminSuspendSchema,
	adminUpdateUserSchema,
	type CreateUserInput,
	createUserSchema,
	type UpdateUserInput,
	updateUserSchema,
} from "./schema.js";

export default async function userRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Create a User
	appWithZod.post<{ Body: CreateUserInput }>(
		"/create",
		{
			schema: {
				tags: ["Users"],
				body: createUserSchema,
			},
		},
		UserHandlers.RegisterUserHandler,
	);

	// Fetch Current User
	appWithZod.get(
		"/fetch",
		{
			preHandler: [app.authenticate, isUser],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Users"],
			},
		},
		UserHandlers.CurrentUserHandler,
	);

	// Update User
	appWithZod.patch<{ Body: UpdateUserInput }>(
		"/update",
		{
			preHandler: [app.authenticate, isSuspended],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Users"],
				body: updateUserSchema,
			},
		},
		UserHandlers.UpdateUserHandler,
	);

	// Admin Routes

	// Suspend a User
	appWithZod.patch<{ Params: IdInput; Body: AdminSuspendInput }>(
		"/suspend/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Users"],
				params: idSchema,
				body: adminSuspendSchema,
			},
		},
		UserHandlers.SuspendUserHandler,
	);

	// Update a User
	appWithZod.patch<{ Params: IdInput; Body: AdminUpdateUserInput }>(
		"/update/user/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Users"],
				params: idSchema,
				body: adminUpdateUserSchema,
			},
		},
		UserHandlers.AdminUpdateUserHandler,
	);

	// Fetch all Users
	appWithZod.get<{ Querystring: PaginationInput }>(
		"/fetch/user/all",
		{
			preHandler: [app.authenticate, isAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Users"],
				querystring: paginationSchema,
			},
		},
		UserHandlers.GetAllUsersHandler,
	);

	// Fetch a User
	appWithZod.get<{ Params: IdInput }>(
		"/fetch/user/:id",
		{
			preHandler: [app.authenticate, isAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Users"],
				params: idSchema,
			},
		},
		UserHandlers.GetUserProfileHandler,
	);
}
