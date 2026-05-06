import { z } from "zod";

// Create User Schema
export const createUserSchema = z.object({
	username: z
		.string()
		.min(3, { error: "Username cannot be less than 3 Chars" })
		.max(40, { error: "Username cannot be more than 40 Chars" })
		.trim(),
	fullName: z
		.string()
		.min(2, { error: "Full Name cannot be less than 2 Chars" })
		.trim(),
	email: z.email().toLowerCase().trim(),
	phoneNumber: z.string(),
	country: z.string().min(2, { error: "Country cannot be less than 2 Chars" }),
	password: z
		.string()
		.min(6, { error: "Password must be at least 6 characters long" }),
	referral: z
		.string()
		.min(3, { error: "Username cannot be less than 3 Chars" })
		.max(40, { error: "Username cannot be more than 40 Chars" })
		.optional(),
});

// User Update Schema
export const updateUserSchema = z.object({
	fullName: z
		.string()
		.min(2, { error: "Full Name cannot be less than 2 Chars" })
		.trim()
		.optional(),
	phoneNumber: z.string().optional(),
	country: z
		.string()
		.min(2, { error: "Country cannot be less than 2 Chars" })
		.optional(),
	password: z
		.string()
		.min(6, { error: "Password must be at least 6 characters long" })
		.optional(),
});

// Admin Update User Schema
export const adminUpdateUserSchema = updateUserSchema.extend({
	username: z
		.string()
		.min(3, { error: "Username cannot be less than 3 Chars" })
		.max(40, { error: "Username cannot be more than 40 Chars" })
		.trim()
		.optional(),

	email: z
		.string()
		.email({ message: "Invalid email address" })
		.transform((s) => s.trim().toLowerCase())
		.optional(),
});

// Admin Suspend User Schema
export const adminSuspendSchema = z.object({
	duration: z.coerce.number().int().default(1),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
export type AdminSuspendInput = z.infer<typeof adminSuspendSchema>;
