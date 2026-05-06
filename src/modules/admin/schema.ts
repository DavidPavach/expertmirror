import { z } from "zod";

export const createAdminSchema = z.object({
	email: z.email().toLowerCase().trim(),
	password: z
		.string()
		.min(8, { error: "Admin passwords must be at least 8 characters long" }),
	role: z.enum(["SUPER_ADMIN", "ADMIN"]).default("ADMIN"),
});

export const updateAdminSchema = z.object({
	email: z.email().toLowerCase().trim().optional(),
	password: z
		.string()
		.min(8, { error: "Admin passwords must be at least 8 characters long" })
		.optional(),
	role: z.enum(["SUPER_ADMIN", "ADMIN"]).default("ADMIN").optional(),
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
