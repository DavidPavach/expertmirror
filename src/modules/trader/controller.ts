import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import type { IdInput, PaginationInput } from "../general/schema.js";
import type { CreateCopyInput, UpdateCopyInput } from "./schema.js";
import * as TraderServices from "./service.js";

// Create New Handler
export const CreateCopyHandler = async (
	request: FastifyRequest<{ Body: CreateCopyInput }>,
	reply: FastifyReply,
) => {
	// Create and return response
	const body = request.body;
	await TraderServices.createCopyTrader(body);
	return sendResponse(reply, 201, true, "Copy trader created successfully");
};

// Get Traders
export const GetAllCopiesHandler = async (
	request: FastifyRequest<{ Querystring: PaginationInput }>,
	reply: FastifyReply,
) => {
	// Fetch Traders and return
	const { page, limit } = request.query;
	const result = await TraderServices.getPaginatedCopies(page, limit);
	return sendResponse(reply, 200, true, "Traders fetched successfully", result);
};

// Get a Trader
export const GetCopyHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	const trader = await TraderServices.getCopyTraderById(request.params.id);

	// Return 400 if Trader doesn't exist
	if (!trader) return sendResponse(reply, 404, false, "Copy trader not found");
	return sendResponse(reply, 200, true, "Trader fetched successfully", trader);
};

// Admin

// Update Trader
export const UpdateCopyHandler = async (
	request: FastifyRequest<{ Params: IdInput; Body: UpdateCopyInput }>,
	reply: FastifyReply,
) => {
	const body = request.body;
	await TraderServices.updateCopyTrader(request.params.id, body);
	return sendResponse(reply, 200, true, "Trader updated successfully");
};

// Delete Trader
export const DeleteCopyHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	await TraderServices.deleteCopyTrader(request.params.id);
	return sendResponse(reply, 200, true, "Trader deleted successfully");
};
