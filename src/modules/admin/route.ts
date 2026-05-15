import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { isAdmin, isSuperAdmin } from "../../middlewares/security.js";
import { type IdInput, idSchema } from "../general/schema.js";
import * as AdminController from "./controller.js";
import {
	type CreateAdminInput,
	createAdminSchema,
	type UpdateAdminInput,
	updateAdminSchema,
} from "./schema.js";

export default async function adminRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Create a New Admin
	appWithZod.post<{ Body: CreateAdminInput }>(
		"/create",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Admins"],
				body: createAdminSchema,
			},
		},
		AdminController.RegisterAdminHandler,
	);

	// Get Current Admin
	appWithZod.get(
		"/fetch",
		{
			preHandler: [app.authenticate, isAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Admins"],
			},
		},
		AdminController.GetAdminHandler,
	);

	// Get all Admin
	appWithZod.get(
		"/fetch/all",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Admins"],
			},
		},
		AdminController.GetAdminsHandler,
	);

	// Update Admin
	appWithZod.patch<{ Params: IdInput; Body: UpdateAdminInput }>(
		"/update/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Admins"],
				params: idSchema,
				body: updateAdminSchema,
			},
		},
		AdminController.UpdateAdminHandler,
	);

	// Delete Admin
	appWithZod.delete<{ Params: IdInput }>(
		"/delete/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Admins"],
				params: idSchema,
			},
		},
		AdminController.DeleteAdminHandler,
	);
}
