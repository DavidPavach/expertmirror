import mongoose, { type Document, Schema } from "mongoose";

export interface TradeDoc extends Document {
	user: mongoose.Types.ObjectId;
	asset: string;
	tradeType: "BUY" | "SELL";
	amount: number;
	leverage: string;
	entryPrice: number;
	closePrice?: number;
	profit: number;
	expiration?: Date;
	status: "OPEN" | "WON" | "LOST" | "CLOSED" | "CANCELLED";
	createdAt: Date;
	updatedAt: Date;
}

const tradeSchema = new Schema<TradeDoc>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		asset: { type: String, required: true },
		tradeType: { type: String, enum: ["BUY", "SELL"], required: true },
		amount: { type: Number, required: true },
		leverage: { type: String, default: "1:20" },
		entryPrice: { type: Number, required: true },
		closePrice: { type: Number },
		profit: { type: Number, default: 0 },
		expiration: { type: Date },
		status: {
			type: String,
			enum: ["OPEN", "WON", "LOST", "CLOSED", "CANCELLED"],
			default: "OPEN",
		},
	},
	{ timestamps: true },
);

const TradeModel = mongoose.model<TradeDoc>("Trade", tradeSchema);
export default TradeModel;
