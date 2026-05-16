import { z } from "zod";

// Pagination & Filtering
export const transactionQuerySchema = z.object({
	page: z.coerce.number().int().nonnegative().optional().default(1),
	limit: z.coerce.number().int().nonnegative().optional().default(10),
	type: z.enum(["DEPOSIT", "WITHDRAWAL", "BONUS", "PENALTY"]).optional(),
});

// User Creation Schema
export const userTransactionSchema = z
	.object({
		type: z.enum(["DEPOSIT", "WITHDRAWAL"], {
			error: "Transaction type must be DEPOSIT or WITHDRAWAL",
		}),
		cryptoSymbol: z.string({ error: "Crypto symbol is required" }),
		amount: z
			.number({ error: "Amount is required" })
			.min(1, "Minimum amount is 1"),
		hash: z.string().optional(),
		walletAddress: z.string().optional(),
	})
	.refine(
		(data) => {
			// Custom validation to ensure the right fields are present
			if (data.type === "DEPOSIT" && !data.hash) return false;
			if (data.type === "WITHDRAWAL" && !data.walletAddress) return false;
			return true;
		},
		{
			message:
				"Deposits require a Transaction evidence. Withdrawals require a wallet address.",
		},
	);

// Admin Creation Schema
export const adminTransactionSchema = z.object({
	type: z.enum(["DEPOSIT", "WITHDRAWAL", "BONUS", "PENALTY"]),
	status: z
		.enum(["PENDING", "APPROVED", "REJECTED"])
		.optional()
		.default("APPROVED"),
	cryptoSymbol: z.string({ error: "Crypto symbol is required" }),
	amount: z.number().min(1, "Minimum amount is 1"),
	hash: z.string().optional(),
	walletAddress: z.string().optional(),
});

// Admin Update Schema
export const updateTransactionSchema = adminTransactionSchema.partial();

export type UserTransactionInput = z.infer<typeof userTransactionSchema>;
export type AdminTransactionInput = z.infer<typeof adminTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
