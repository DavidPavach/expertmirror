import { z } from "zod";

// Document Enum
const DocumentTypeEnum = z.enum([
	"International Passport",
	"Drivers License",
	"National ID Card",
]);

export const createKycSchema = z.object({
	firstName: z
		.string()
		.min(2, { error: "First Name must be more than 2 Chars" })
		.trim(),
	lastName: z
		.string()
		.min(2, { error: "Last Name must be more than 2 Chars" })
		.trim(),
	email: z.email().toLowerCase().trim(),
	phoneNumber: z
		.string()
		.min(5, { error: "Phone Number must be more than 5 Chars" }),
	dateOfBirth: z.coerce.date(),
	socialMediaUsername: z.string().optional(),
	streetAddress: z
		.string()
		.min(5, { error: "Address must be more than 5 Chars" }),
	city: z.string().min(2, { error: "City must be more than 2 Chars" }),
	state: z.string().min(2, { error: "State must be more than 2 Chars" }),
	country: z.string().min(2, { error: "Country must be more than 2 Chars" }),
	documentType: DocumentTypeEnum,
	frontSide: z.url({ error: "Must be a valid S3 URL" }),
	backSide: z.url().optional(),
});

export const updateKycSchema = createKycSchema.partial().extend({
	status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export type CreateKycInput = z.infer<typeof createKycSchema>;
export type UpdateKycInput = z.infer<typeof updateKycSchema>;
