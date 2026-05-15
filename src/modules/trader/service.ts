import CopyModel from "./model.js";
import type { CreateCopyInput, UpdateCopyInput } from "./schema.js";

// Create a new copy trader
export const createCopyTrader = async (input: CreateCopyInput) => {
	return await CopyModel.create(input);
};

// Fetch copy traders
export const getPaginatedCopies = async (page: number, limit: number) => {
	const skip = (page === 1 ? 0 : page - 1) * limit;

	const [copies, totalDocuments] = await Promise.all([
		CopyModel.find()
			.sort({ winRate: -1, totalFollowers: -1 })
			.skip(skip)
			.limit(limit),
		CopyModel.countDocuments(),
	]);

	const totalPages = Math.ceil(totalDocuments / limit);

	return {
		data: copies,
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

// Find trader by Id
export const getCopyTraderById = async (id: string) => {
	return await CopyModel.findById(id);
};

// Update copy trader
export const updateCopyTrader = async (
	id: string,
	updateData: UpdateCopyInput,
) => {
	const updated = await CopyModel.findByIdAndUpdate(id, updateData, {
		returnDocument: "after",
		runValidators: true,
	});
	if (!updated) throw new Error("Copy trader not found");
	return updated;
};

// Delete copy trader
export const deleteCopyTrader = async (id: string) => {
	const result = await CopyModel.findByIdAndDelete(id);
	if (!result) throw new Error("Copy trader not found");
	return true;
};
