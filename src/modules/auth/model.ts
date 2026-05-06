import mongoose, { type Document, Schema } from "mongoose";

export interface AuthDoc extends Document {
	user: mongoose.Types.ObjectId;
	userType: "User" | "Admin";
	jti: string;
	ip?: string;
	device?: {
		ua?: string;
		type?: string;
		os?: string;
		browser?: string;
	};
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

const authSchema = new Schema<AuthDoc>(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: "userType",
		},
		userType: {
			type: String,
			required: true,
			enum: ["User", "Admin"],
		},
		jti: { type: String, required: true, unique: true },
		ip: { type: String },
		device: {
			ua: { type: String },
			type: {
				type: String,
				enum: [
					"desktop",
					"mobile",
					"tablet",
					"console",
					"embedded",
					"smarttv",
					"wearable",
					"xr",
				],
			},
			os: { type: String },
			browser: { type: String },
		},
		expiresAt: { type: Date, required: true, expires: 0 },
	},
	{
		timestamps: true,
	},
);

const AuthModel = mongoose.model<AuthDoc>("Auth", authSchema);
export default AuthModel;
