import { z } from "zod";

// Create
export const createCopySchema = z.object({
	name: z.string().min(2, { error: "Name is required" }).trim(),
	title: z.string().min(2, { error: "Title is required" }).trim(),
	profilePicture: z.url({ error: "Must be a valid URL" }),
	active: z.boolean().default(true),
	ratings: z.number({ error: "Ratings are required" }).min(0).max(5).default(0),
	ratingsTotal: z
		.number({ error: "Total Ratings are required" })
		.int()
		.nonnegative({ error: "Total Ratings cannot be negative" })
		.default(0),
	winRate: z
		.number({ error: "Win Rate is required" })
		.min(0)
		.max(100)
		.default(0),
	totalReturn: z.number({ error: "Total Return is needed" }).default(0),
	equity: z
		.number({ error: "Equity is required" })
		.nonnegative({ error: "Equity cannot be negative" })
		.default(0),
	totalTrades: z
		.number({ error: "Total Trades is required" })
		.int()
		.nonnegative({ error: "Total Trades cannot be negative" })
		.default(0),
	minInvestment: z
		.number({ error: "Minimum Investment is required" })
		.nonnegative({ error: "Minimum Investment cannot be negative" })
		.default(0),
	totalFollowers: z
		.number({ error: "Total Followers is required" })
		.int()
		.nonnegative({ error: "Total Followers cannot be negative" })
		.default(0),
});

// Update
export const updateCopySchema = createCopySchema.partial();

export type CreateCopyInput = z.infer<typeof createCopySchema>;
export type UpdateCopyInput = z.infer<typeof updateCopySchema>;
