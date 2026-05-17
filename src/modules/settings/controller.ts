import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import type { IdInput } from "../general/schema.js";
import type { UpdateSettingsInput } from "./schema.js";
import {
	getGlobalSettings,
	removeDepositCoin,
	removeWithdrawalCoin,
	updateGlobalSettings,
} from "./service.js";

// Get settings
export const GetSettingsHandler = async (
	_: FastifyRequest,
	reply: FastifyReply,
) => {
	// Fetch settings and return
	const settings = await getGlobalSettings();
	return sendResponse(reply, 200, true, "Settings", settings);
};

// Update settings
export const UpdateSettingsHandler = async (
	request: FastifyRequest<{ Body: UpdateSettingsInput }>,
	reply: FastifyReply,
) => {
	const body = request.body;

	// Update the database and return
	await updateGlobalSettings(body);
	return sendResponse(reply, 200, true, "Settings was updated successfully");
};

// Delete Deposit Coin
export const DeleteDepositCoinHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	const id = request.params.id;

	// Remove coin and return
	await removeDepositCoin(id);
	return sendResponse(reply, 200, true, "Deposit coin deleted successfully");
};

// Delete Withdrawal Coin
export const DeleteWithdrawalCoinHandler = async (
	request: FastifyRequest<{ Params: IdInput }>,
	reply: FastifyReply,
) => {
	const id = request.params.id;

	// Remove coin and return
	await removeWithdrawalCoin(id);
	return sendResponse(reply, 200, true, "Withdrawal coin deleted successfully");
};
