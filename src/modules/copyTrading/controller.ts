import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import type { IdInput, PaginationInput } from "../general/schema.js";
import { getCopyTraderById } from "../trader/service.js";
import { getUserDashboardStats } from "../transaction/service.js";
import type { StartCopyingInput, UpdateCopyStatsInput } from "./schema.js";
import * as CopyInvestmentService from "./service.js";

// Start a Copy Trading
export const StartCopyTradeHandler = async (
	request: FastifyRequest<{ Body: StartCopyingInput }>,
	reply: FastifyReply,
) => {
	const userId = request.user.id;
	const masterTraderId = request.body.masterTraderId;

	// Fetch Trader, throw an error if it doesn't exist
	const trader = await getCopyTraderById(masterTraderId);
	if (!trader) return sendResponse(reply, 404, false, "Trader does not exist");

	// Make sure the user has available balance
	const { availableBalance } = await getUserDashboardStats(userId);
	if (availableBalance < trader.minInvestment)
		return sendResponse(
			reply,
			400,
			false,
			"You do not have the balance to copy this trader.",
		);

	// Create copy trading and return
	await CopyInvestmentService.startCopying(
		userId,
		masterTraderId,
		trader.minInvestment,
		trader.minInvestment,
	);
	return sendResponse(reply, 201, true, "Successfully copying trader");
};

// Get a Users Copy Trading
export const GetMyCopyTradesHandler = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const userId = request.user.id;

	// Fetch copy trades and return
	const copyTrades = await CopyInvestmentService.getUserCopyTrading(userId);
	return sendResponse(reply, 200, true, "Copy Trades were fetched", copyTrades);
};

// Stop Copy Trading
export const StopCopyTraderHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	const id = request.params.id;

	// Update and Return
	await CopyInvestmentService.closeCopyTrading(id);
	return sendResponse(reply, 200, true, "Investment closed successfully");
};

// Admin

// Update Copy Trading
export const UpdateCopyTradeHandler = async (
	request: FastifyRequest<{ Params: IdInput; Body: UpdateCopyStatsInput }>,
	reply: FastifyReply,
) => {
	const body = request.body;
	const id = request.params.id;

	// Update and return
	await CopyInvestmentService.updateCopyTrading(id, body);
	return sendResponse(reply, 200, true, "Stats updated");
};

// Get All Copy Trading
export const GetAllCopyTradings = async (
	request: FastifyRequest<{ Querystring: PaginationInput }>,
	reply: FastifyReply,
) => {
	const { page, limit } = request.query;

	// Fetch Copy Trading and Return
	const result = await CopyInvestmentService.fetchAllCopyTrading(page, limit);
	return sendResponse(
		reply,
		200,
		true,
		"Copy Tradings were fetched successfully",
		result,
	);
};
