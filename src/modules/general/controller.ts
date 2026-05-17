import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import { getAdminById } from "../admin/service.js";
import { getUserById } from "../user/service.js";
import type { PresignRequestInput } from "./schema.js";
import { generatePresignedUrls } from "./service.js";

// Generate Presigned Urls
export const GetPresignedUrlsHandler = async (
	request: FastifyRequest<{ Body: PresignRequestInput }>,
	reply: FastifyReply,
) => {
	const userId = request.user.id;
	let accountId = "";

	// Fetch User
	const user = await getUserById(userId);
	const admin = await getAdminById(userId);
	if (!user && !admin) return sendResponse(reply, 404, false, "User not Found");
	if (user) accountId = user.accountId;
	if (admin) accountId = admin.adminId;

	if (!accountId)
		return sendResponse(reply, 400, false, "Account ID not found");

	// Generate Presigned Url and Return
	const body = request.body;
	const urls = await generatePresignedUrls(accountId, body);

	return sendResponse(reply, 200, true, "Your Presigned Urls", urls);
};
