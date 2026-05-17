import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { isSuperAdmin } from "../../middlewares/security.js";
import { type IdInput, idSchema } from "../general/schema.js";
import * as SettingsHandler from "./controller.js";
import { type UpdateSettingsInput, updateSettingsSchema } from "./schema.js";

export default async function settingsRoutes(app: FastifyInstance) {
	const appWithZod = app.withTypeProvider<ZodTypeProvider>();

	// Get Settings
	appWithZod.get(
		"/get",
		{
			preHandler: [app.authenticate],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Settings"],
			},
		},
		SettingsHandler.GetSettingsHandler,
	);

	// Admin

	// Update Settings
	appWithZod.patch<{ Body: UpdateSettingsInput }>(
		"/update",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Settings"],
				body: updateSettingsSchema,
			},
		},
		SettingsHandler.UpdateSettingsHandler,
	);

	// Delete Deposit Coin
	appWithZod.delete<{ Params: IdInput }>(
		"/deposit/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Settings"],
				params: idSchema,
			},
		},
		SettingsHandler.DeleteDepositCoinHandler,
	);

	// Delete Withdrawal Coin
	appWithZod.delete<{ Params: IdInput }>(
		"/withdrawal/:id",
		{
			preHandler: [app.authenticate, isSuperAdmin],
			schema: {
				security: [{ bearerAuth: [] }],
				tags: ["Settings"],
				params: idSchema,
			},
		},
		SettingsHandler.DeleteWithdrawalCoinHandler,
	);
}
