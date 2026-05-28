import { z } from "zod";
import { objectIdValidator } from "../general/schema.js";

export const createNotificationSchema = z.object({
	user: objectIdValidator,
	title: z.string().min(1).max(100),
	message: z.string().min(1).max(500),
	type: z.enum(["INFO", "SUCCESS", "WARNING", "ERROR"]),
	trigger: z.enum([
		"SYSTEM",
		"TRANSACTION",
		"TRADE",
		"COPY_TRADING",
		"REFERRAL",
		"KYC",
		"OTHER",
	]),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
