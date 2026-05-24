import { z } from "zod";

export const createTradeSchema = z.object({
	asset: z
		.string()
		.min(1, { error: "Asset symbol is required (e.g., BTC/USD)" }),
	tradeType: z.enum(["BUY", "SELL"], {
		error: "Trade type must be BUY or SELL",
	}),
	amount: z.number().min(1, { error: "Minimum investment amount is 1" }),
	leverage: z.string({ error: "Leverage must be at least 1x" }),
	entryPrice: z.number().positive({ error: "Entry price is required" }),
	expiration: z.coerce.date().optional(),
});

// Admin or System schema to close a trade
export const closeTradeSchema = z.object({
	closePrice: z.number().positive({ error: "Close price is required" }),
	profit: z.number(),
	status: z.enum(["WON", "LOST", "CLOSED"]),
});

export type CreateTradeInput = z.infer<typeof createTradeSchema>;
export type CloseTradeInput = z.infer<typeof closeTradeSchema>;
