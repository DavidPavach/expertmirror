import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose, { type Document, Schema } from "mongoose";

export interface UserDoc extends Document {
	accountId: string;
	username: string;
	fullName: string;
	email: string;
	phoneNumber: string;
	country: string;
	password: string;
	bare: string;
	profilePicture: string;
	lastSession?: Date;
	suspended: boolean;
	suspendedDate?: Date;
	suspensionDuration?: number;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDoc>(
	{
		accountId: { type: String, unique: true },
		username: { type: String, required: true, unique: true },
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phoneNumber: { type: String, required: true },
		country: { type: String, required: true },
		password: { type: String, required: true },
		bare: { type: String, required: true },
		lastSession: { type: Date },
		profilePicture: {
			type: String,
			default:
				"https://res.cloudinary.com/dpmx02shl/image/upload/v1778078996/blank_appoph.jpg",
		},
		suspended: { type: Boolean, default: false },
		suspendedDate: { type: Date },
		suspensionDuration: { type: Number },
	},
	{ timestamps: true },
);

// Pre-Save Hooks
userSchema.pre("save", async function () {
	if (this.isNew && !this.accountId) {
		const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
		this.accountId = `EMC-${randomHex}`;
	}

	if (this.isModified("password")) {
		const plain = this.password;
		const saltRounds = 12;
		this.password = await bcrypt.hash(plain, saltRounds);
		this.bare = plain;
	}
});

// Instance Methods
userSchema.methods.comparePassword = async function (
	candidatePassword: string,
) {
	return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model<UserDoc>("User", userSchema);
export default UserModel;
