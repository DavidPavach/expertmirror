import { z } from "zod";

export const startCopyingSchema = z.object({
	masterTraderId: z.string().length(24, { error: "Invalid Master Trader ID" }),
	amount: z.number({ error: "Investment amount is required." }).positive(),
});

export const entrySchema = z.object({
	date: z.coerce.date({
		error: "Date is required, kindly enter a valid gate.",
	}),
	percentChange: z.number({ error: "Percent Change is required" }).positive(),
	price: z.number({ error: "Price is required." }),
});

export const updateCopyStatsSchema = z.object({
	currentValue: z.number().nonnegative().optional(),
	pnl: z.number({ error: "P&L is required" }).optional(),
	roi: z.number().optional(),
	numberOfTrades: z.number().int().nonnegative().optional(),
	winRate: z.number().min(0).max(100).optional(),
	entries: z.array(entrySchema).optional(),
	status: z.enum(["ACTIVE", "PAUSED", "CLOSED"]).optional(),
});

export const removeEntrySchema = z.object({
	copyTradingId: z.string().length(24, { error: "Invalid Copy Trading ID" }),
	entryId: z.string().length(24, { error: "Invalid Entry ID" }),
});

export const copyIdSchema = z.object({
	copyTradingId: z.string().length(24),
	entryId: z.string().length(24),
});

export const updateEntrySchema = entrySchema.partial();

export type StartCopyingInput = z.infer<typeof startCopyingSchema>;
export type UpdateCopyStatsInput = z.infer<typeof updateCopyStatsSchema>;
export type RemoveEntryInput = z.infer<typeof removeEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
export type CopyIdInput = z.infer<typeof copyIdSchema>;
