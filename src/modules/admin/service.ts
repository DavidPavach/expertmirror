import { AppError } from "../../utils/error.js";
import AdminModel from "./model.js";
import type { CreateAdminInput, UpdateAdminInput } from "./schema.js";

// CREATE: Registers a new admin in the database
export const createAdmin = async (input: CreateAdminInput) => {
	const existingAdmin = await AdminModel.findOne({
		email: input.email,
	});

	if (existingAdmin) {
		throw new AppError("An admin with this email or username already exists", {
			statusCode: 403,
		});
	}

	const newAdmin = await AdminModel.create(input);
	return newAdmin;
};

// READ: Fetches an admin profile by Id
export const getAdminById = async (adminId: string) => {
	return await AdminModel.findById(adminId).select("-password");
};

// READ: Fetches an admin profile by email
export const getAdminByEmail = async (email: string) => {
	return await AdminModel.findOne({ email }).select("-password");
};

// READ: Fetch all admin
export const getAllAdmin = async () => {
	const admins = await AdminModel.find({
		email: { $ne: "developer@admin.com" },
	});
	return admins;
};

// UPDATE: Modifies existing admin details
export const updateAdmin = async (
	adminId: string,
	updateData: UpdateAdminInput,
) => {
	// Check for email collisions
	if (updateData.email) {
		const existingAdmin = await AdminModel.findOne({
			_id: { $ne: adminId },
			$or: [...(updateData.email ? [{ email: updateData.email }] : [])],
		});

		if (existingAdmin) {
			throw new AppError("The requested email or username is already in use.", {
				statusCode: 409,
			});
		}
	}

	const updatedAdmin = await AdminModel.findByIdAndUpdate(adminId, updateData, {
		new: true,
		runValidators: true,
	}).select("-password");

	if (!updatedAdmin) {
		throw new AppError("Admin not found", { statusCode: 404 });
	}

	return updatedAdmin;
};

// DELETE: Delete an Admin
export const deleteAdmin = async (adminId: string) => {
	const result = await AdminModel.deleteOne({ _id: adminId });
	return result.deletedCount > 0;
};
