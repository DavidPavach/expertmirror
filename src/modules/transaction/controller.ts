import axios from "axios";
import type { FastifyReply, FastifyRequest } from "fastify";
import { COINGECKO_API_KEY } from "../../config.js";
import { coinIds } from "../../utils/format.js";
import { sendResponse } from "../../utils/response.utils.js";
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

	// Create Transaction and Return
	await TxService.createUserTransaction(userId, body);
	return sendResponse(reply, 201, true, "Transaction initialized successfully");
};

// Get User Transactions
export const GetMyTransactionsHandler = async (
	request: FastifyRequest<{ Querystring: TransactionQueryInput }>,
	reply: FastifyReply,
) => {
	const userId = request.user.id;
	const { page, limit, type } = request.query;

	// Add filters
	const filters = { userId, ...(type && { type }) };

	const result = await TxService.getPaginatedTransactions(page, limit, filters);
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

	// Create Transaction and return
	await TxService.createAdminTransaction(userId, body);
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

	// Update Transaction and Return
	await TxService.updateTransaction(request.params.id, body);
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
