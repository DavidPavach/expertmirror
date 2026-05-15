import { Types } from "mongoose";
import { z } from "zod";

// MongoDB ObjectID validator
export const objectIdValidator = z
	.string()
	.refine((val) => Types.ObjectId.isValid(val), {
		error: "Invalid ObjectId",
	});

// General ID Schema
export const idSchema = z.object({
	id: objectIdValidator,
});

// Pagination Schema
export const paginationSchema = z.object({
	page: z.coerce
		.number({ error: "Page must be a number" })
		.int({ error: "Page must be an integer" })
		.nonnegative({ error: "Page cannot be a negative number" }),
	limit: z.coerce
		.number({ error: "Limit must be a number" })
		.int({ error: "Limit must be an integer" })
		.nonnegative({ error: "Limit cannot be a negative number" }),
});

// Presign Schema
export const presignItemSchema = z.object({
	contentType: z.string().min(1, { error: "Content type is required" }),
	fileSize: z.number().positive({ error: "File size must be positive" }),
	fileName: z.string().min(1, { error: "File name is required" }),
});

export const presignRequestSchema = z.object({
	items: z
		.array(presignItemSchema)
		.min(1, { error: "At least one file is required" }),
});

export type IdInput = z.infer<typeof idSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type PresignRequestInput = z.infer<typeof presignRequestSchema>;
