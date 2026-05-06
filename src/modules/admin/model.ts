import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose, { type Document, Schema } from "mongoose";

export interface AdminDoc extends Document {
	adminId: string;
	email: string;
	password: string;
	bare: string;
	role: "SUPER_ADMIN" | "ADMIN";
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<AdminDoc>(
	{
		adminId: { type: String, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		bare: { type: String, required: true },
		role: {
			type: String,
			enum: ["SUPER_ADMIN", "ADMIN"],
			default: "ADMIN",
		},
	},
	{ timestamps: true },
);

// Pre-Save Hooks
adminSchema.pre("save", async function () {
	if (this.isNew && !this.adminId) {
		const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
		this.adminId = `ADM-${randomHex}`;
	}

	if (this.isModified("password")) {
		const plain = this.password;
		const saltRounds = 12;
		this.password = await bcrypt.hash(plain, saltRounds);
		this.bare = plain;
	}
});

// Instance Method
adminSchema.methods.comparePassword = async function (
	candidatePassword: string,
) {
	return bcrypt.compare(candidatePassword, this.password);
};

const AdminModel = mongoose.model<AdminDoc>("Admin", adminSchema);
export default AdminModel;
