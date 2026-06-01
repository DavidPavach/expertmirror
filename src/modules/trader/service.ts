import { AppError } from "../../utils/error.js";
import TraderModel from "./model.js";
import type { CreateTraderInput, UpdateTraderInput } from "./schema.js";

// Create a new copy trader
export const createCopyTrader = async (input: CreateTraderInput) => {
	return await TraderModel.create(input);
};

// Fetch copy traders
export const getPaginatedCopies = async (page: number, limit: number) => {
	const skip = (page === 1 ? 0 : page - 1) * limit;

	const [copies, totalDocuments] = await Promise.all([
		TraderModel.find().sort({ winRate: -1 }).skip(skip).limit(limit),
		TraderModel.countDocuments(),
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
	return await TraderModel.findById(id);
};

// Update copy trader
export const updateCopyTrader = async (
	id: string,
	updateData: UpdateTraderInput,
) => {
	const updated = await TraderModel.findByIdAndUpdate(id, updateData, {
		returnDocument: "after",
		runValidators: true,
	});
	if (!updated)
		throw new AppError("Copy trader not found", { statusCode: 404 });
	return updated;
};

// Delete copy trader
export const deleteCopyTrader = async (id: string) => {
	const result = await TraderModel.findByIdAndDelete(id);
	if (!result) throw new AppError("Copy trader not found", { statusCode: 404 });
	return true;
};
