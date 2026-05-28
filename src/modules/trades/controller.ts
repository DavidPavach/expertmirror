import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import { notify } from "../../utils/socket.js";
import type { IdInput, PaginationInput } from "../general/schema.js";
import type { CloseTradeInput, CreateTradeInput } from "./schema.js";
import * as TradeService from "./service.js";

// Create (Open) a New Trade
export const OpenTradeHandler = async (
	request: FastifyRequest<{ Body: CreateTradeInput }>,
	reply: FastifyReply,
) => {
	const body = request.body;

	// Create Trade, Notify and Return
	await TradeService.openTrade(request.user.id, body);

	notify({
		userId: request.user.id,
		trigger: "TRADE",
		save: true,
		data: {
			title: "Trade Opened! 🚀",
			message: `Your trade has been opened successfully.`,
			type: "SUCCESS",
		},
	});
	return sendResponse(reply, 200, true, "Trade opened");
};

// Get User Trades
export const GetUserTradeHandler = async (
	request: FastifyRequest<{ Querystring: PaginationInput }>,
	reply: FastifyReply,
) => {
	const { page, limit } = request.query;

	// Fetch Trade and Return
	const trades = await TradeService.getUserTrades(request.user.id, page, limit);
	return sendResponse(
		reply,
		200,
		true,
		"Trades were fetched successfully",
		trades,
	);
};

// Admin

// Close a Trade
export const CloseTradeHandler = async (
	request: FastifyRequest<{ Params: IdInput; Body: CloseTradeInput }>,
	reply: FastifyReply,
) => {
	const body = request.body;

	// Close Trade, Notify and Return
	const closedTrade = await TradeService.closeTrade(request.params.id, body);
	notify({
		userId: closedTrade.user.toString(),
		trigger: "TRADE",
		save: true,
		data: {
			title: "Trade Closed! 🚀",
			message: `Your trade has been closed successfully.`,
			type: "SUCCESS",
		},
	});
	return sendResponse(reply, 200, true, "Trade closed");
};

// Delete a Trade
export const DeleteTradeHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	const id = request.params.id;

	// Delete and Return
	await TradeService.deleteTrade(id);
	return sendResponse(reply, 200, true, "Trade Deleted");
};

// Get All Trades
export const GetAllTradeHandler = async (
	request: FastifyRequest<{ Querystring: PaginationInput }>,
	reply: FastifyReply,
) => {
	const { page, limit } = request.query;

	// Fetch Trade and Return
	const trades = await TradeService.getAllTrades(page, limit);
	return sendResponse(
		reply,
		200,
		true,
		"Trades were fetched successfully",
		trades,
	);
};
