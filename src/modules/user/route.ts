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
	type IdStringInput,
	idSchema,
	idStringSchema,
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
	type PasswordResetEmailInput,
	passwordResetEmailSchema,
	passwordResetSchema,
	type ResetPasswordInput,
	type UpdateUserInput,
	updateUserSchema,
	type VerifyPasswordResetInput,
	verifyPasswordResetSchema,
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

	// Send Forgot Password Email
	appWithZod.post<{ Body: PasswordResetEmailInput }>(
		"/reset",
		{
			schema: {
				tags: ["Users"],
				body: passwordResetEmailSchema,
			},
		},
		UserHandlers.SendPasswordResetHandler,
	);

	// Verify Reset Email
	appWithZod.post<{ Body: VerifyPasswordResetInput }>(
		"/verify-reset",
		{
			schema: {
				tags: ["Users"],
				body: verifyPasswordResetSchema,
			},
		},
		UserHandlers.VerifyPasswordResetHandler,
	);

	// Password Reset
	appWithZod.post<{ Body: ResetPasswordInput }>(
		"/password-reset",
		{
			schema: {
				tags: ["Users"],
				body: passwordResetSchema,
			},
		},
		UserHandlers.PasswordResetHandler,
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
	appWithZod.get<{ Params: IdStringInput }>(
		"/fetch/user/:identifier",
		{
			preHandler: [app.authenticate, isAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Users"],
				params: idStringSchema,
			},
		},
		UserHandlers.GetAUserHandler,
	);
}
