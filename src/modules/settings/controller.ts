import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import type { UpdateSettingsInput } from "./schema.js";
import { getGlobalSettings, updateGlobalSettings } from "./service.js";

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
