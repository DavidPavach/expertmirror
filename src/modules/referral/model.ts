import mongoose, { type Document, Schema } from "mongoose";

export interface ReferralDoc extends Document {
	referrerId: mongoose.Types.ObjectId;
	referredUserId: mongoose.Types.ObjectId;
	rewardAmount: number;
	createdAt: Date;
	updatedAt: Date;
}

const referralSchema = new Schema<ReferralDoc>(
	{
		referrerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
		referredUserId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		rewardAmount: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

const ReferralModel = mongoose.model<ReferralDoc>("Referral", referralSchema);
export default ReferralModel;
