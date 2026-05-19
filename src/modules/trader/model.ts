import mongoose, { type Document, Schema } from "mongoose";

export interface TraderDoc extends Document {
	name: string;
	title: string;
	bio: string;
	profilePicture: string;
	active: boolean;
	ratings: number;
	ratingsTotal: number;
	winRate: number;
	totalReturn: number;
	equity: number;
	totalTrades: number;
	minInvestment: number;
	totalFollowers: number;
	createdAt: Date;
	updatedAt: Date;
}

const traderSchema = new Schema<TraderDoc>(
	{
		name: { type: String, required: true },
		title: { type: String, required: true },
		bio: { type: String, required: true },
		profilePicture: { type: String, required: true },
		active: { type: Boolean, default: true },
		ratings: { type: Number, default: 0, min: 0, max: 5 },
		ratingsTotal: { type: Number, default: 0 },
		winRate: { type: Number, default: 0, min: 0, max: 100 },
		totalReturn: { type: Number, default: 0 },
		equity: { type: Number, default: 0 },
		totalTrades: { type: Number, default: 0 },
		minInvestment: { type: Number, default: 0 },
		totalFollowers: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

const TraderModel = mongoose.model<TraderDoc>("Trader", traderSchema);
export default TraderModel;
