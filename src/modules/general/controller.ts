import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import { getUserById } from "../user/service.js";
import type { PresignRequestInput } from "./schema.js";
import { generatePresignedUrls } from "./service.js";

// Generate Presigned Urls
export const GetPresignedUrlsHandler = async (
	request: FastifyRequest<{ Body: PresignRequestInput }>,
	reply: FastifyReply,
) => {
	const userId = request.user.id;

	// Fetch User
	const user = await getUserById(userId);
	if (!user) return sendResponse(reply, 404, false, "User not Found");

	// Generate Presigned Url and Return
	const body = request.body;
	const urls = await generatePresignedUrls(user.accountId, body);

	return sendResponse(reply, 200, true, "Your Presigned Urls", urls);
};
