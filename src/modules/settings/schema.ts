import { z } from "zod";

// Define the shape of a single Coin, Deposit Coin, and Withdrawal Coin object
export const depositCoinSchema = z.object({
	coinName: z.string().min(1, { error: "Coin name is required" }),
	symbol: z.string().min(1, { error: "Symbol is required" }).toUpperCase(),
	qrCode: z.url({ error: "Must be a valid URL for the QR image" }),
	walletAddress: z.string().min(5, { error: "Wallet address is required" }),
});

export const withdrawalCoinSchema = z.object({
	coinName: z.string().min(1, { error: "Coin name is required" }),
	symbol: z.string().min(1, { error: "Symbol is required" }).toUpperCase(),
});

// Define the main Settings update payload
export const updateSettingsSchema = z.object({
	threshold: z
		.number()
		.nonnegative({ error: "Threshold cannot be negative" })
		.optional(),
	whatsAppNumber: z
		.string({ error: "WhatsApp Number must be a string " })
		.optional(),
	address: z.string({ error: "Address must be a string" }).optional(),
	thresholdText: z.string({ error: "Threshold Text must be a string" }).optional(),
	depositCoins: z.array(depositCoinSchema).optional(),
	withdrawalCoins: z.array(withdrawalCoinSchema).optional(),
	minDeposit: z
		.number()
		.nonnegative({ error: "Threshold cannot be negative" })
		.optional(),
	minWithdrawal: z
		.number()
		.nonnegative({ error: "Threshold cannot be negative" })
		.optional(),
	noWithdrawal: z.boolean().optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
