import { AppError } from "../../utils/error.js";
import TradeModel from "./model.js";
import type { CloseTradeInput, CreateTradeInput } from "./schema.js";

// Create new trade
export const openTrade = async (userId: string, input: CreateTradeInput) => {
	return await TradeModel.create({ ...input, user: userId });
};

// Get user trades
export const getUserTrades = async (
	userId: string,
	page: number,
	limit: number,
) => {
	const skip = (page === 1 ? 0 : page - 1) * limit;
	const [trades, total] = await Promise.all([
		TradeModel.find({ user: userId })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		TradeModel.countDocuments({ user: userId }),
	]);

	return {
		data: trades,
		pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
};

// Admin

// Close trade
export const closeTrade = async (tradeId: string, input: CloseTradeInput) => {
	const updated = await TradeModel.findByIdAndUpdate(tradeId, input, {
		returnDocument: "after",
	});
	if (!updated) throw new Error("Trade not found");
	return updated;
};

// Delete Trade
export const deleteTrade = async (tradeId: string) => {
	const result = await TradeModel.findByIdAndDelete(tradeId);
	if (!result) throw new AppError("Copy trader not found", { statusCode: 404 });
	return true;
};

// Get All Trades
export const getAllTrades = async (page: number, limit: number) => {
	const skip = (page === 1 ? 0 : page - 1) * limit;
	const [trades, total] = await Promise.all([
		TradeModel.find()
			.populate("user", "-password")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit),
		TradeModel.countDocuments(),
	]);

	return {
		data: trades,
		pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
	};
};
