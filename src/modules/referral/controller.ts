import type { FastifyReply, FastifyRequest } from "fastify";
import { sendResponse } from "../../utils/response.utils.js";
import type { PaginationInput } from "../general/schema.js";
import * as ReferralService from "./service.js";

// Get a user's referral
export const GetMyReferralsHandler = async (
	request: FastifyRequest<{ Querystring: PaginationInput }>,
	reply: FastifyReply,
) => {
	const userId = request.user.id;
	const { page, limit } = request.query;

	// Fetch Referrals and Return
	const result = await ReferralService.getUserReferrals(userId, page, limit);
	return sendResponse(reply, 200, true, "Referrals fetched", result);
};

// Admin

// Fetch All Referrals
export const GetAllReferralsHandler = async (
	request: FastifyRequest<{ Querystring: PaginationInput }>,
	reply: FastifyReply,
) => {
	const { page, limit } = request.query;

	// Fetch All Referrals And Return
	const result = await ReferralService.getPaginatedUsers(page, limit);
	return sendResponse(
		reply,
		200,
		true,
		"Referrals Were Fetched Successfully",
		result,
	);
};
