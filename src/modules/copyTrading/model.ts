import mongoose, { type Document, Schema } from "mongoose";

export interface Entry {
	commodity: string;
	amount: number;
	type: "BUY" | "SELL";
	result: "LOSS" | "PROFIT";
}

export interface CopyTradingDoc extends Document {
	user: mongoose.Types.ObjectId;
	masterTraderId: mongoose.Types.ObjectId;
	investment: number;
	currentValue: number;
	pnl: number;
	roi: number;
	numberOfTrades: number;
	winRate: number;
	entries: Entry[];
	status: "ACTIVE" | "PAUSED" | "CLOSED";
	createdAt: Date;
	updatedAt: Date;
}

const EntrySchema = new Schema<Entry>(
	{
		commodity: { type: String, required: true },
		amount: { type: Number, required: true },
		type: {
			type: String,
			enum: ["BUY", "SELL"],
			default: "SELL",
		},
		result: {
			type: String,
			enum: ["LOSS", "PROFIT"],
			default: "LOSS",
		},
	},
	{ _id: true },
);

const copyTradingSchema = new Schema<CopyTradingDoc>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		masterTraderId: {
			type: Schema.Types.ObjectId,
			ref: "Trader",
			required: true,
		},
		investment: { type: Number, required: true },
		currentValue: { type: Number, required: true },
		pnl: { type: Number, default: 0 },
		roi: { type: Number, default: 0 },
		numberOfTrades: { type: Number, default: 0 },
		winRate: { type: Number, default: 0 },
		entries: { type: [EntrySchema], default: [] },
		status: {
			type: String,
			enum: ["ACTIVE", "PAUSED", "CLOSED"],
			default: "ACTIVE",
		},
	},
	{ timestamps: true },
);

const CopyTradingModel = mongoose.model<CopyTradingDoc>(
	"CopyTrading",
	copyTradingSchema,
);

export default CopyTradingModel;
