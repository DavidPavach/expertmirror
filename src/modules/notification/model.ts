import mongoose, { type Document, Schema } from "mongoose";

export interface NotificationDoc extends Document {
	user: mongoose.Types.ObjectId;
	title: string;
	message: string;
	trigger:
		| "SYSTEM"
		| "USER_ACTION"
		| "TRADE"
		| "COPY_TRADING"
		| "REFERRAL"
		| "KYC"
		| "OTHER";
	type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
	isRead: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDoc>(
	{
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
		title: { type: String, required: true },
		message: { type: String, required: true },
		type: {
			type: String,
			enum: ["INFO", "SUCCESS", "WARNING", "ERROR"],
			default: "INFO",
		},
		trigger: {
			type: String,
			enum: [
				"SYSTEM",
				"TRANSACTION",
				"TRADE",
				"COPY_TRADING",
				"REFERRAL",
				"KYC",
				"OTHER",
			],
			default: "SYSTEM",
		},
		isRead: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

const NotificationModel = mongoose.model<NotificationDoc>(
	"Notification",
	notificationSchema,
);

export default NotificationModel;
