import { AppError } from "../../utils/error.js";
import CopyTradingModel from "./model.js";
import type { UpdateCopyStatsInput } from "./schema.js";

// Create new copy trading
export const startCopying = async (
	userId: string,
	masterTraderId: string,
	currentValue: number,
	investment: number,
) => {
	// Check if user is already copying this trader
	const existing = await CopyTradingModel.findOne({
		user: userId,
		masterTraderId,
		status: "ACTIVE",
	});

	if (existing)
		throw new AppError("You are already actively copying this trader.", {
			statusCode: 404,
		});

	return await CopyTradingModel.create({
		masterTraderId,
		user: userId,
		currentValue,
		investment,
	});
};

// User GEt Copy Trading
export const getUserCopyTrading = async (userId: string) => {
	return await CopyTradingModel.find({ user: userId })
		.populate("masterTraderId")
		.sort({ createdAt: -1 });
};

// Update Copy Trading
export const updateCopyTrading = async (
	id: string,
	stats: UpdateCopyStatsInput,
) => {
	const updated = await CopyTradingModel.findByIdAndUpdate(id, stats, {
		returnDocument: "after",
	});
	if (!updated)
		throw new AppError("Copy Trader not found", { statusCode: 404 });
	return updated;
};

// Close Copy Trading
export const closeCopyTrading = async (id: string) => {
	const updated = await CopyTradingModel.findByIdAndUpdate(
		id,
		{ status: "CLOSED" },
		{ returnDocument: "after" },
	);
	if (!updated)
		throw new AppError("Copy Trader not found", { statusCode: 404 });
	return updated;
};

// Get All Copy Trading
export const fetchAllCopyTrading = async (page: number, limit: number) => {
	const skip = (page === 0 ? 0 : page - 1) * limit;

	const [trades, totalTrades] = await Promise.all([
		CopyTradingModel.find()
			.populate("masterTraderId")
			.populate("user")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		CopyTradingModel.countDocuments(),
	]);

	// Calculate the total number of pages
	const totalPages = Math.ceil(totalTrades / limit);

	return {
		data: trades,
		pagination: {
			total: totalTrades,
			page,
			limit,
			totalPages,
		},
	};
};
