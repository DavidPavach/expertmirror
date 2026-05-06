import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
	identifier: z
		.string({ error: "Username or Email is required" })
		.min(3, { error: "Username or Email must be at least 3 characters long" })
		.trim(),

	password: z
		.string({ error: "Password is required" })
		.min(6, { error: "Password must be at least 6 characters long" }),

	device: z.object({
		ua: z.string().optional(),
		type: z
			.enum([
				"desktop",
				"mobile",
				"tablet",
				"console",
				"embedded",
				"smarttv",
				"wearable",
				"xr",
			])
			.optional(),
		os: z.string().optional(),
		browser: z.string().optional(),
	}),

	rememberMe: z.coerce.boolean().optional().default(false),
});

// Service Schema
export const serviceSchema = z.object({
	device: z.object({
		ua: z.string().optional(),
		type: z
			.enum([
				"desktop",
				"mobile",
				"tablet",
				"console",
				"embedded",
				"smarttv",
				"wearable",
				"xr",
			])
			.optional(),
		os: z.string().optional(),
		browser: z.string().optional(),
	}),

	rememberMe: z.coerce.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
