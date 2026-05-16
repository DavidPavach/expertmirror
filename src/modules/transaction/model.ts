import mongoose, { type Document, Schema } from "mongoose";

export interface TransactionDoc extends Document {
	user: mongoose.Types.ObjectId;
	type: "DEPOSIT" | "WITHDRAWAL" | "BONUS" | "PENALTY";
	status: "PENDING" | "APPROVED" | "REJECTED";
	amount: number;
	cryptoSymbol: string;
	walletAddress?: string;
	hash?: string;
	createdAt: Date;
	updatedAt: Date;
}

const TransactionSchema = new Schema<TransactionDoc>(
	{
		user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
		type: {
			type: String,
			enum: ["DEPOSIT", "WITHDRAWAL", "BONUS", "PENALTY"],
			required: true,
		},
		status: {
			type: String,
			enum: ["PENDING", "APPROVED", "REJECTED"],
			default: "PENDING",
		},
		amount: { type: Number, required: true },
		cryptoSymbol: { type: String, required: true },
		hash: { type: String },
		walletAddress: { type: String },
	},
	{ timestamps: true },
);

const TransactionModel = mongoose.model<TransactionDoc>(
	"Transaction",
	TransactionSchema,
);

export default TransactionModel;
