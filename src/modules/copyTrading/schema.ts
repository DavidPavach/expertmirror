import { z } from "zod";

export const startCopyingSchema = z.object({
	masterTraderId: z.string().length(24, { error: "Invalid Master Trader ID" }),
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
});

export type StartCopyingInput = z.infer<typeof startCopyingSchema>;
export type UpdateCopyStatsInput = z.infer<typeof updateCopyStatsSchema>;
