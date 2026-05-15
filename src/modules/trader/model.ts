import mongoose, { type Document, Schema } from "mongoose";

export interface CopyDoc extends Document {
	name: string;
	title: string;
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

const copySchema = new Schema<CopyDoc>(
	{
		name: { type: String, required: true },
		title: { type: String, required: true },
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

const CopyModel = mongoose.model<CopyDoc>("Copy", copySchema);
export default CopyModel;
