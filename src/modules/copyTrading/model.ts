import mongoose, { type Document, Schema } from "mongoose";

export interface Entry {
	date: Date;
	percentChange: number;
	price: number;
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
		date: { type: Date, required: true },
		percentChange: { type: Number, required: true },
		price: { type: Number, required: true },
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
