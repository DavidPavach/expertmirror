import { AppError } from "../../utils/error.js";
import { KycModel } from "./model.js";
import type { CreateKycInput, UpdateKycInput } from "./schema.js";

// POST: Create a new KYC for the user
export const submitKyc = async (userId: string, input: CreateKycInput) => {
	const existingKyc = await KycModel.findOne({ user: userId });
	if (existingKyc) {
		throw new AppError("KYC has already been submitted for this user.");
	}

	return await KycModel.create({ ...input, user: userId });
};

// READ: Fetch a user KYC
export const getKyc = async (userId: string) => {
	return await KycModel.findOne({ user: userId });
};

// READ ALL: Fetches a paginated list of KYC records
export const getPaginatedKycs = async (page: number, limit: number) => {
	const skip = (page === 1 ? 0 : page - 1) * limit;

	const [kycs, totalDocuments] = await Promise.all([
		KycModel.find()
			.populate("user", "-password")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		KycModel.countDocuments(),
	]);

	const totalPages = Math.ceil(totalDocuments / limit);

	return {
		data: kycs,
		pagination: {
			total: totalDocuments,
			page,
			limit,
			totalPages,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
	};
};

// UPDATE: Modifies an existing KYC record
export const updateKycById = async (
	kycId: string,
	updateData: UpdateKycInput,
) => {
	const updatedKyc = await KycModel.findByIdAndUpdate(kycId, updateData, {
		new: true,
		runValidators: true,
	}).populate("userId", "-password");

	if (!updatedKyc) {
		throw new AppError("KYC record not found", { statusCode: 404 });
	}

	return updatedKyc;
};

// DELETE: Removes a KYC record from the database
export const deleteKycById = async (kycId: string) => {
	const result = await KycModel.findByIdAndDelete(kycId);
	if (!result) {
		throw new AppError("KYC record not found", { statusCode: 404 });
	}
	return true;
};
