import { AppError } from "../../utils/error.js";
import CopyTradingModel from "./model.js";
import type { UpdateCopyStatsInput, UpdateEntryInput } from "./schema.js";

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

// User Get Copy Trading
export const getUserCopyTrading = async (userId: string) => {
	return await CopyTradingModel.find({ user: userId })
		.populate("masterTraderId")
		.sort({ createdAt: -1 })
		.lean();
};

// Fetch Copy Trading by ID
export const getCopyTradingById = async (id: string) => {
	return await CopyTradingModel.findById(id).populate("masterTraderId").lean();
};

// Update Copy Trading
export const updateCopyTrading = async (
	id: string,
	stats: UpdateCopyStatsInput,
) => {
	// Separate the entries array from the standard fields
	const { entries, ...primitiveStats } = stats;

	// biome-ignore lint/suspicious/noExplicitAny: <>
	const updateQuery: any = {};

	if (Object.keys(primitiveStats).length > 0) {
		updateQuery.$set = primitiveStats;
	}

	if (entries && entries.length > 0) {
		updateQuery.$push = {
			entries: { $each: entries },
		};
	}

	const updated = await CopyTradingModel.findByIdAndUpdate(id, updateQuery, {
		returnDocument: "after",
		runValidators: true,
	});

	if (!updated) {
		throw new AppError("Copy Trader not found", { statusCode: 404 });
	}

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

// Remove Entry
export const removeEntry = async (copyTradingId: string, entryId: string) => {
	const updated = await CopyTradingModel.findByIdAndUpdate(
		copyTradingId,
		{
			$pull: { entries: { _id: entryId } },
		},
		{ returnDocument: "after" },
	);

	if (!updated) {
		throw new AppError("Copy Trader not found", { statusCode: 404 });
	}

	return updated;
};

// Update Entry
export const updateEntry = async (
	copyTradingId: string,
	entryId: string,
	updateData: UpdateEntryInput,
) => {
	const setUpdate: Record<string, string | number | Date> = {};

	if (updateData.date) {
		setUpdate["entries.$.date"] = updateData.date;
	}
	if (updateData.percentChange !== undefined) {
		setUpdate["entries.$.percentChange"] = updateData.percentChange;
	}
	if (updateData.price !== undefined) {
		setUpdate["entries.$.price"] = updateData.price;
	}

	// Perform the database update
	const updated = await CopyTradingModel.findOneAndUpdate(
		{
			_id: copyTradingId,
			"entries._id": entryId,
		},
		{
			$set: setUpdate,
		},
		{
			returnDocument: "after",
			runValidators: true,
		},
	);

	if (!updated) {
		throw new AppError("Copy Trader or specific Entry not found", {
			statusCode: 404,
		});
	}

	return updated;
};
