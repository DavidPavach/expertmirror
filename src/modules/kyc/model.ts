import mongoose, { type Document, Schema } from "mongoose";

export interface KycDoc extends Document {
	user: mongoose.Types.ObjectId;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	dateOfBirth: Date;
	socialMediaUsername?: string;
	streetAddress: string;
	city: string;
	stateProvince: string;
	countryNationality: string;
	documentType:
		| "International Passport"
		| "Drivers License"
		| "National ID Card";
	frontSide: string;
	backSide?: string;
	status: "PENDING" | "APPROVED" | "REJECTED";
	createdAt: Date;
	updatedAt: Date;
}

const kycSchema = new Schema<KycDoc>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		phoneNumber: { type: String, required: true },
		dateOfBirth: { type: Date, required: true },
		socialMediaUsername: { type: String },
		streetAddress: { type: String, required: true },
		city: { type: String, required: true },
		stateProvince: { type: String, required: true },
		countryNationality: { type: String, required: true },
		documentType: {
			type: String,
			enum: ["International Passport", "Drivers License", "National ID Card"],
			required: true,
		},
		frontSide: { type: String, required: true },
		backSide: { type: String },
		status: {
			type: String,
			enum: ["PENDING", "APPROVED", "REJECTED"],
			default: "PENDING",
		},
	},
	{ timestamps: true },
);

export const KycModel = mongoose.model<KycDoc>("Kyc", kycSchema);
