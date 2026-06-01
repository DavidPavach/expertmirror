import mongoose, { type QueryFilter } from "mongoose";
import { AppError } from "../../utils/error.js";
import CopyTradingModel from "../copyTrading/model.js";
import TradeModel from "../trades/model.js";
import TransactionModel, { type TransactionDoc } from "./model.js";
import type {
	AdminTransactionInput,
	UpdateTransactionInput,
	UserTransactionInput,
} from "./schema.js";

// User New Transaction
export const createUserTransaction = async (
	userId: string,
	input: UserTransactionInput,
) => {
	return await TransactionModel.create({
		...input,
		user: userId,
		status: "PENDING",
	});
};

// Balance Aggregation
export const getUserDashboardStats = async (userId: string) => {
	const objectId = new mongoose.Types.ObjectId(userId);

	// Run all three database aggregations concurrently
	const [txStats, tradeStats, copyStats] = await Promise.all([
		TransactionModel.aggregate([
			{
				$match: {
					user: objectId,
					status: { $in: ["APPROVED", "PENDING"] },
				},
			},
			{
				$group: {
					_id: null,
					approvedDeposits: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: ["$type", "DEPOSIT"] },
										{ $eq: ["$status", "APPROVED"] },
									],
								},
								"$amount",
								0,
							],
						},
					},
					approvedBonuses: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: ["$type", "BONUS"] },
										{ $eq: ["$status", "APPROVED"] },
									],
								},
								"$amount",
								0,
							],
						},
					},
					totalWithdrawals: {
						$sum: { $cond: [{ $eq: ["$type", "WITHDRAWAL"] }, "$amount", 0] },
					},
					approvedPenalties: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: ["$type", "PENALTY"] },
										{ $eq: ["$status", "APPROVED"] },
									],
								},
								"$amount",
								0,
							],
						},
					},
					approvedProfits: {
						$sum: {
							$cond: [
								{
									$and: [
										{ $eq: ["$type", "PROFIT"] },
										{ $eq: ["$status", "APPROVED"] },
									],
								},
								"$amount",
								0,
							],
						},
					},
				},
			},
		]),

		// Trades Aggregation (Updated to fetch WON profit AND OPEN amounts)
		TradeModel.aggregate([
			{
				$match: {
					user: objectId,
					status: { $in: ["WON", "OPEN"] },
				},
			},
			{
				$group: {
					_id: null,
					// Sum profit only if the trade is WON
					totalTradeProfit: {
						$sum: { $cond: [{ $eq: ["$status", "WON"] }, "$profit", 0] },
					},
					// Sum loss only if the trade is LOST
					totalTradeLoss: {
						$sum: { $cond: [{ $eq: ["$status", "LOST"] }, "$profit", 0] },
					},
					// Sum the initial amount as locked funds if the trade is OPEN
					lockedTradeAmount: {
						$sum: { $cond: [{ $eq: ["$status", "OPEN"] }, "$amount", 0] },
					},
				},
			},
		]),

		// Copy Trading Aggregation (Updated to fetch CLOSED profit AND ACTIVE investments)
		CopyTradingModel.aggregate([
			{
				$match: {
					user: objectId,
					status: { $in: ["CLOSED", "ACTIVE"] }, // Fetch both closed and active copies
				},
			},
			{
				$group: {
					_id: null,
					// Sum (currentValue - investment) only if CLOSED
					totalCopyProfit: {
						$sum: {
							$cond: [
								{ $eq: ["$status", "CLOSED"] },
								{ $subtract: ["$currentValue", "$investment"] },
								0,
							],
						},
					},
					// Sum the investment as locked funds if ACTIVE
					lockedCopyInvestment: {
						$sum: { $cond: [{ $eq: ["$status", "ACTIVE"] }, "$investment", 0] },
					},
				},
			},
		]),
	]);

	// --- Data Extraction with Safe Fallbacks ---
	const txData = txStats[0] || {
		approvedDeposits: 0,
		approvedBonuses: 0,
		totalWithdrawals: 0,
		approvedPenalties: 0,
		approvedProfits: 0,
	};

	const tradeData = tradeStats[0] || {
		totalTradeProfit: 0,
		totalTradeLoss: 0,
		lockedTradeAmount: 0,
	};
	const copyData = copyStats[0] || {
		totalCopyProfit: 0,
		lockedCopyInvestment: 0,
	};

	// --- Calculations ---

	// Calculate Total Profit
	const totalProfit =
		txData.approvedProfits +
		tradeData.totalTradeProfit +
		copyData.totalCopyProfit;

	// Calculate Total Locked Funds
	const totalLockedFunds =
		tradeData.lockedTradeAmount + copyData.lockedCopyInvestment;

	// Calculate Available Balance
	// Formula: (Money In) - (Money Out) - (Locked Money)
	const availableBalance =
		txData.approvedDeposits +
		txData.approvedBonuses +
		totalProfit -
		(txData.totalWithdrawals +
			txData.approvedPenalties +
			totalLockedFunds +
			tradeData.totalTradeLoss);

	return {
		...txData,
		totalTradeProfit: tradeData.totalTradeProfit,
		totalTradeLoss: tradeData.totalTradeLoss,
		totalCopyProfit: copyData.totalCopyProfit,
		totalLockedFunds,
		totalProfit,
		availableBalance: Math.max(0, availableBalance),
	};
};

// Fetch Transactions
export const getPaginatedTransactions = async (
	page: number,
	limit: number,
	filters: QueryFilter<TransactionDoc>,
) => {
	const skip = (page === 1 ? 0 : page - 1) * limit;

	const [transactions, totalDocuments] = await Promise.all([
		TransactionModel.find(filters)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("user"),
		TransactionModel.countDocuments(filters),
	]);

	return {
		data: transactions,
		pagination: {
			total: totalDocuments,
			page,
			limit,
			totalPages: Math.ceil(totalDocuments / limit),
		},
	};
};

// Admin Services

// New Transaction Admin
export const createAdminTransaction = async (
	userId: string,
	input: AdminTransactionInput,
) => {
	return await TransactionModel.create({ ...input, user: userId });
};

// Update Transaction
export const updateTransaction = async (
	txId: string,
	updateData: UpdateTransactionInput,
) => {
	const tx = await TransactionModel.findByIdAndUpdate(txId, updateData, {
		new: true,
	});
	if (!tx) throw new AppError("Transaction not found", { statusCode: 404 });
	return tx;
};

// Delete Transaction
export const deleteTransaction = async (txId: string) => {
	const result = await TransactionModel.findByIdAndDelete(txId);
	if (!result) throw new AppError("Transaction not found", { statusCode: 404 });
	return true;
};
