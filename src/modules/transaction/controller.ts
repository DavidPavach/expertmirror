import axios from "axios";
import type { FastifyReply, FastifyRequest } from "fastify";
import { COINGECKO_API_KEY } from "../../config.js";
import { coinIds } from "../../utils/format.js";
import { sendResponse } from "../../utils/response.utils.js";
import { notify } from "../../utils/socket.js";
import type { IdInput } from "../general/schema.js";
import type {
	AdminTransactionInput,
	TransactionQueryInput,
	UpdateTransactionInput,
	UserTransactionInput,
} from "./schema.js";
import * as TxService from "./service.js";

// Constants
const cache = new Map();
const CACHE_KEY = "prices";
const CACHE_TTL = 2 * 60 * 1000;
const coingeckoURL = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(",")}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;

// Fetch Prices Handler
export const FetchPricesHandler = async (
	_: FastifyRequest,
	reply: FastifyReply,
) => {
	const now = Date.now();
	const cached = cache.get(CACHE_KEY);

	if (cached && now - cached.timestamp < CACHE_TTL) {
		return sendResponse(
			reply,
			200,
			true,
			"Coins prices were fetched successfully (from cache)",
			cached.data,
		);
	}

	try {
		const { data } = await axios.get(coingeckoURL, {
			headers: {
				Accept: "application/json",
				"x-cg-demo-api-key": COINGECKO_API_KEY,
			},
		});

		// Cache data and return
		cache.set(CACHE_KEY, { data, timestamp: now });
		return sendResponse(
			reply,
			200,
			true,
			"Coins prices were fetched successfully",
			data,
		);
	} catch (error) {
		console.log("Failed to fetch prices:", error);
		return sendResponse(
			reply,
			500,
			false,
			"Failed to fetch coin prices. Please try again later.",
		);
	}
};

// New Transaction
export const NewTransactionHandler = async (
	request: FastifyRequest<{ Body: UserTransactionInput }>,
	reply: FastifyReply,
) => {
	const userId = request.user.id;
	const body = request.body;

	// Create Transaction, Notify and Return
	const newTx = await TxService.createUserTransaction(userId, body);
	notify({
		userId: request.user.id,
		trigger: "TRANSACTION",
		save: true,
		data: {
			title: "Transaction Initialized! 🚀",
			message: `Your ${newTx.type} transaction has been initialized successfully • Amount: ${newTx.amount.toLocaleString()} USD.`,
			type: "SUCCESS",
		},
	});
	return sendResponse(reply, 201, true, "Transaction initialized successfully");
};

// Get User Transactions
export const GetMyTransactionsHandler = async (
	request: FastifyRequest<{ Querystring: TransactionQueryInput }>,
	reply: FastifyReply,
) => {
	const userId = request.user.id;
	const { page, limit, type, others } = request.query;

	// Initialize the filters object with the userId
	// biome-ignore lint/suspicious/noExplicitAny: <>
	const filters: any = { user: userId };

	if (others === true) {
		filters.type = { $nin: ["DEPOSIT", "WITHDRAWAL"] };
	} else if (type) {
		filters.type = type;
	}

	// Pass the filters to your unified service
	const result = await TxService.getPaginatedTransactions(page, limit, filters);

	// Send the response
	return sendResponse(
		reply,
		200,
		true,
		"Transactions were fetched successfully",
		result,
	);
};

// Get Dashboard Stats
export const GetUserDashboardHandler = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const userId = request.user.id;

	// Fetch Stats and return
	const stats = await TxService.getUserDashboardStats(userId);
	return sendResponse(
		reply,
		200,
		true,
		"Dashboard Stats was fetched successfully",
		stats,
	);
};

// ADMIN CONTROLLERS

// Admin New Transactions
export const AdminCreateTransactionHandler = async (
	request: FastifyRequest<{ Params: IdInput; Body: AdminTransactionInput }>,
	reply: FastifyReply,
) => {
	const userId = request.params.id;
	const body = request.body;

	// Create Transaction, Notify and Return
	const newTx = await TxService.createAdminTransaction(userId, body);
	notify({
		userId: newTx.user.toString(),
		trigger: "TRANSACTION",
		save: true,
		data: {
			title: "Transaction Created! 🚀",
			message: `Your ${newTx.type} transaction has been created successfully • Amount: ${newTx.amount.toLocaleString()} USD.`,
			type: "SUCCESS",
		},
	});
	return sendResponse(reply, 201, true, "Admin transaction created");
};

// Get All Transactions
export const AdminGetAllTransactionsHandler = async (
	request: FastifyRequest<{ Querystring: TransactionQueryInput }>,
	reply: FastifyReply,
) => {
	const { page, limit, type } = request.query;

	// Create Filter Fetch Everything and Return
	const filters = type ? { type } : {};

	const result = await TxService.getPaginatedTransactions(page, limit, filters);
	return sendResponse(
		reply,
		200,
		true,
		"Transactions were fetched successfully",
		result,
	);
};

// Update Transaction
export const AdminUpdateTransactionHandler = async (
	request: FastifyRequest<{ Params: IdInput; Body: UpdateTransactionInput }>,
	reply: FastifyReply,
) => {
	const body = request.body;

	// Update Transaction, Notify and Return
	const updatedTx = await TxService.updateTransaction(request.params.id, body);
	notify({
		userId: updatedTx.user.toString(),
		trigger: "TRANSACTION",
		save: true,
		data: {
			title: "Transaction Updated! 🚀",
			message: `Your ${updatedTx.type} transaction was updated, • Status: ${updatedTx.status}.`,
			type: "SUCCESS",
		},
	});
	return sendResponse(reply, 200, true, "Transaction Updated");
};

// Delete Transaction
export const AdminDeleteTransactionHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	// Delete and Return
	await TxService.deleteTransaction(request.params.id);
	return sendResponse(reply, 200, true, "Transaction deleted");
};
