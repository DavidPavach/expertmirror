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
import * as ReferralHandlers from "./controller.js";
import {
	type CreateNotificationInput,
	createNotificationSchema,
} from "./schema.js";

// Schemas

export default async function notificationRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Get Users Referral
	appWithZod.get<{ Querystring: PaginationInput }>(
		"/fetch",
		{
			preHandler: [app.authenticate, isUser],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Notifications"],
				querystring: paginationSchema,
			},
		},
		ReferralHandlers.GetNotificationsHandler,
	);

	// Mark Notification as Read
	appWithZod.patch<{ Params: IdInput }>(
		"/mark/:id",
		{
			preHandler: [app.authenticate, isUser],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Notifications"],
				params: idSchema,
			},
		},
		ReferralHandlers.MarkNotificationReadHandler,
	);

	// Delete Notification
	appWithZod.delete<{ Params: IdInput }>(
		"/delete/:id",
		{
			preHandler: [app.authenticate, isSuspended],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Notifications"],
				params: idSchema,
			},
		},
		ReferralHandlers.DeleteNotificationHandler,
	);

	// Admin

	// Create a New Notification
	appWithZod.post<{
		Body: CreateNotificationInput;
	}>(
		"/new",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Notifications"],
				body: createNotificationSchema,
			},
		},
		ReferralHandlers.CreateNotificationHandler,
	);
}
