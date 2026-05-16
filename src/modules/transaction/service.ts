import mongoose, { type QueryFilter } from "mongoose";
import { AppError } from "../../utils/error.js";
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

// New Transaction Admin
export const createAdminTransaction = async (
	userId: string,
	input: AdminTransactionInput,
) => {
	return await TransactionModel.create({ ...input, user: userId });
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

// Balance Aggregation
export const getUserDashboardStats = async (userId: string) => {
	const stats = await TransactionModel.aggregate([
		{
			$match: {
				user: new mongoose.Types.ObjectId(userId),
				// Only count APPROVED for adding, but count APPROVED/PENDING for deducting withdrawals
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
			},
		},
	]);

	const data = stats[0] || {
		approvedDeposits: 0,
		approvedBonuses: 0,
		totalWithdrawals: 0,
		approvedPenalties: 0,
	};

	// Balance = (Deposits + Bonuses) - (Withdrawals + Penalties)
	const availableBalance =
		data.approvedDeposits +
		data.approvedBonuses -
		(data.totalWithdrawals + data.approvedPenalties);

	return {
		...data,
		availableBalance: Math.max(0, availableBalance),
	};
};
