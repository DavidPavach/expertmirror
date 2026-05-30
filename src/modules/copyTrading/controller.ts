import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import { notify } from "../../utils/socket.js";
import type { IdInput, PaginationInput } from "../general/schema.js";
import { getCopyTraderById } from "../trader/service.js";
import { getUserDashboardStats } from "../transaction/service.js";
import type {
	CopyIdInput,
	RemoveEntryInput,
	StartCopyingInput,
	UpdateCopyStatsInput,
	UpdateEntryInput,
} from "./schema.js";
import * as CopyInvestmentService from "./service.js";

// Start a Copy Trading
export const StartCopyTradeHandler = async (
	request: FastifyRequest<{ Body: StartCopyingInput }>,
	reply: FastifyReply,
) => {
	const userId = request.user.id;
	const { masterTraderId, amount } = request.body;

	// Fetch Trader, throw an error if it doesn't exist
	const trader = await getCopyTraderById(masterTraderId);
	if (!trader) return sendResponse(reply, 404, false, "Trader does not exist");

	// Make sure the user has available balance
	const { availableBalance } = await getUserDashboardStats(userId);
	if (availableBalance < trader.minInvestment || availableBalance < amount)
		return sendResponse(
			reply,
			400,
			false,
			"You do not have the balance to copy this trader.",
		);

	// Create copy trading, notify return
	await CopyInvestmentService.startCopying(
		userId,
		masterTraderId,
		amount,
		amount,
	);

	// Notify User
	notify({
		userId: userId,
		trigger: "COPY_TRADING",
		save: true,
		data: {
			title: "Copy Trading Activated",
			message: `You are now successfully copying ${trader.name}. Their trades will automatically mirror on your account.`,
			type: "INFO",
		},
	});
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

	const copyTrading = await CopyInvestmentService.getCopyTradingById(id);
	if (!copyTrading)
		return sendResponse(reply, 404, false, "Copy Trading not found");

	const trader = await getCopyTraderById(
		copyTrading.masterTraderId._id.toString(),
	);
	if (!trader)
		return sendResponse(reply, 404, false, "Master Trader not found");

	// Update, Notify and Return
	await CopyInvestmentService.closeCopyTrading(id);

	// Notify User
	notify({
		userId: copyTrading.user.toString(),
		trigger: "COPY_TRADING",
		save: true,
		data: {
			title: "Copy Trading Stopped",
			message: `Your Copy trading subscription to ${trader.name} has been paused.`,
			type: "WARNING",
		},
	});
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

	const copyTrading = await CopyInvestmentService.getCopyTradingById(id);
	if (!copyTrading)
		return sendResponse(reply, 404, false, "Copy Trading not found");

	const trader = await getCopyTraderById(
		copyTrading.masterTraderId._id.toString(),
	);
	if (!trader)
		return sendResponse(reply, 404, false, "Master Trader not found");

	// Update, notify and return
	await CopyInvestmentService.updateCopyTrading(id, body);

	notify({
		userId: copyTrading.user.toString(),
		trigger: "COPY_TRADING",
		save: true,
		data: {
			title: "Copy Trading Updated",
			message: `Your Copy trading subscription to ${trader.name} has been updated.`,
			type: "INFO",
		},
	});
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

// Remove Entry
export const RemoveCopyEntryHandler = async (
	request: FastifyRequest<{ Body: RemoveEntryInput }>,
	reply: FastifyReply,
) => {
	const { copyTradingId, entryId } = request.body;

	// Update and return
	await CopyInvestmentService.removeEntry(copyTradingId, entryId);
	return sendResponse(reply, 200, true, "Entry removed successfully");
};

// Update Entry
export const UpdateCopyEntryHandler = async (
	request: FastifyRequest<{
		Params: CopyIdInput;
		Body: UpdateEntryInput;
	}>,
	reply: FastifyReply,
) => {
	const { copyTradingId, entryId } = request.params;
	const body = request.body;

	// Update and return
	await CopyInvestmentService.updateEntry(copyTradingId, entryId, body);
	return sendResponse(reply, 200, true, "Entry updated successfully");
};
